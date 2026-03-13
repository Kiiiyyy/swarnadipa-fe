/**
 * Scroll Reveal Animation System
 * Smooth fade-in and slide-up animations triggered by scroll
 */

class ScrollReveal {
  constructor() {
    this.elements = [];
    this.windowHeight = window.innerHeight;
    this.initElements();
    this.setupObserver();
    this.bindEvents();
  }

  /**
   * Initialize elements to be revealed
   */
  initElements() {
    // Select all elements that should be animated
    const selectors = [
      ".hero",
      ".service-card",
      ".solution-card",
      ".product-category-card",
      ".product-item",
      ".company-grid",
      ".company-brand-item",
      ".contact-info-item",
      ".stock-page-heading",
      ".stock-filter-section",
      ".stock-table-wrap",
      ".product-detail-media",
      ".product-detail-info",
      ".under-construction-box",
      ".page-header",
      ".product-section-heading",
      ".product-list-section .products-list > *",
    ];

    // Add reveal class to all matching elements
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        if (!element.classList.contains("scroll-reveal")) {
          element.classList.add("scroll-reveal");
          element.style.transitionDelay = `${index * 0.1}s`;
          this.elements.push(element);
        }
      });
    });
  }

  /**
   * Setup Intersection Observer for better performance
   */
  setupObserver() {
    const options = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Optional: unobserve after reveal to improve performance
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements
    this.elements.forEach((element) => {
      this.observer.observe(element);
    });
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Re-calculate window height on resize
    window.addEventListener("resize", () => {
      this.windowHeight = window.innerHeight;
    });

    // Trigger check on page load
    window.addEventListener("load", () => {
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        this.checkVisibility();
      }, 100);
    });
  }

  /**
   * Check visibility of elements (fallback for older browsers)
   */
  checkVisibility() {
    this.elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < this.windowHeight - 100;

      if (isVisible && !element.classList.contains("revealed")) {
        element.classList.add("revealed");
      }
    });
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ScrollReveal();
  });
} else {
  new ScrollReveal();
}
