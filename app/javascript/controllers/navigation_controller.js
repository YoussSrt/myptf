import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  connect() {
    this.setupNavigationHandlers()
    this.initializeAnimations()
  }

  setupNavigationHandlers() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const section = e.target.getAttribute('href').replace('/', '')
        this.loadSection(section)
      })
    })
  }

  async loadSection(section) {
    try {
      const response = await fetch(`/api/sections/${section}`)
      if (!response.ok) throw new Error('Network response was not ok')

      const content = await response.text()

      // Fade out current content
      const mainContent = document.getElementById('main-content')
      mainContent.style.opacity = 0

      // Wait for fade out animation
      setTimeout(() => {
        // Update content
        mainContent.innerHTML = content

        // Reinitialize animations and scripts
        this.initializeAnimations()

        // Fade in new content
        mainContent.style.opacity = 1

        // Update URL without page reload
        history.pushState({}, '', `/${section}`)

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    } catch (error) {
      console.error('Error loading section:', error)
    }
  }

  initializeAnimations() {
    // Reinitialize AOS
    if (window.AOS) {
      AOS.refresh()
    }

    // Reinitialize Typed.js if needed
    const typedElement = document.getElementById('typed-text')
    if (typedElement && window.Typed) {
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

    // Reinitialize Particles.js if needed
    const particlesElement = document.getElementById('particles-js')
    if (particlesElement && window.particlesJS) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
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

    // Reinitialize Swiper if needed
    const swiperElement = document.querySelector('.testimonials-slider')
    if (swiperElement && window.Swiper) {
      new Swiper('.testimonials-slider', {
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
        fadeEffect: {
          crossFade: true
        }
      })
    }

    // Initialize GSAP animations
    if (window.gsap && window.ScrollTrigger) {
      // Animate sections on scroll
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
