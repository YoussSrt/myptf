import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "mobileMenu", "menuIcon"]

  connect() {
    this.setupNavigationHandlers()
    this.setupResizeHandler()
    this.setupScrollHandler()
  }

  disconnect() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  }

  setupNavigationHandlers() {
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
}
