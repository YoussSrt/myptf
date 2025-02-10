import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "mobileMenu", "menuIcon"]

  connect() {
    this.setupNavigationHandlers()
    this.initializeAnimations()
    this.setupResizeHandler()
    this.setupScrollHandler()
  }

  disconnect() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  }

  setupNavigationHandlers() {
    // Use event delegation instead of multiple event listeners
    document.body.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav-link')
      if (navLink) {
        e.preventDefault()
        const section = navLink.getAttribute('href').replace('/', '')
        this.loadSection(section)
      }
    })
  }

  setupResizeHandler() {
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  setupScrollHandler() {
    // Use throttle to limit scroll event firing
    this.handleScroll = this.throttle(this.updateActiveNavLink.bind(this), 100)
    window.addEventListener('scroll', this.handleScroll)
  }

  handleResize() {
    if (window.innerWidth >= 768) {
      this.mobileMenuTarget.classList.add('hidden')
      this.menuIconTarget.setAttribute('d', 'M4 6h16M4 12h16M4 18h16')
    }
  }

  toggleMobileMenu() {
    const isHidden = this.mobileMenuTarget.classList.contains('hidden')
    this.mobileMenuTarget.classList.toggle('hidden')
    this.mobileMenuTarget.classList.toggle('animate-fade-in')
    this.menuIconTarget.setAttribute('d', isHidden ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16')
  }

  async loadSection(section) {
    try {
      const response = await fetch(`/api/sections/${section}`)
      if (!response.ok) throw new Error('Network response was not ok')

      const content = await response.text()
      this.fadeTransition(() => {
        this.contentTarget.innerHTML = content
        this.initializeAnimations()
        history.pushState({}, '', `/${section}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    } catch (error) {
      console.error('Error loading section:', error)
    }
  }

  fadeTransition(callback) {
    this.contentTarget.style.opacity = 0
    setTimeout(() => {
      callback()
      this.contentTarget.style.opacity = 1
    }, 300)
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('.nav-link')
    const scrollPosition = window.scrollY + window.innerHeight / 3

    let currentSection = ''
    sections.forEach(section => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id')
      }
    })

    navLinks.forEach(link => {
      const indicator = link.querySelector('div')
      const isActive = link.getAttribute('href').replace('#', '') === currentSection
      link.classList.toggle('text-primary', isActive)
      indicator?.classList.toggle('h-full', isActive)
      indicator?.classList.toggle('h-0', !isActive)
    })
  }

  throttle(func, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  initializeAnimations() {
    // Initialize libraries only if they exist
    if (window.AOS) AOS.refresh()

    if (window.Typed && document.getElementById('typed-text')) {
      new Typed('#typed-text', {
        strings: [
          'Full Stack Developer',
          'Ruby on Rails Expert',
          'UI/UX Enthusiast',
          'Problem Solver'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true
      })
    }

    if (window.particlesJS && document.getElementById('particles-js')) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      })
    }

    const swiperElement = document.querySelector('.testimonials-slider')
    if (window.Swiper && swiperElement) {
      new Swiper(swiperElement, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.next-button',
          prevEl: '.prev-button',
        },
        effect: 'fade',
        fadeEffect: { crossFade: true }
      })
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.utils.toArray('.animate-on-scroll').forEach(section => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        })
      })
    }
  }
}
