// Main JavaScript File
// ==========================================
// 1. DYNAMIC NAVBAR INITIALIZATION
// ==========================================

window.initMobileMenu = function() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const whereToBuyBtn = document.querySelector(".where-to-buy");
  const navbarWrapper = document.querySelector(".navbar-wrapper");

  if (menuToggle && navMenu) {
    // Fungsi pindahin tombol "Contact Us" ke dalem menu pas mobile
    function handleMobileMenu() {
      if (window.innerWidth <= 768) {
        if (whereToBuyBtn && !navMenu.contains(whereToBuyBtn)) {
          navMenu.appendChild(whereToBuyBtn);
          whereToBuyBtn.style.display = "block";
        }
      } else {
        if (whereToBuyBtn && navMenu.contains(whereToBuyBtn) && navbarWrapper) {
          navbarWrapper.appendChild(whereToBuyBtn);
        }
      }
    }

    handleMobileMenu();
    window.removeEventListener("resize", handleMobileMenu); // Clean up old listener
    window.addEventListener("resize", handleMobileMenu);

    // Toggle Hamburger
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu pas link diklik
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
};
// Contact Form Handler with Web3Forms
const contactForm = document.getElementById("contactForm");

// Create custom modal popup for alerts
const createCustomModal = (type, message) => {
  // Remove existing modal if any
  const existingModal = document.querySelector(".custom-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.className = "custom-modal";
  modal.innerHTML = `
    <div class="modal-content modal-${type}">
      <div class="modal-icon">
        ${type === "success" ? "✓" : "!"}
      </div>
      <h3 class="modal-title">${type === "success" ? "Berhasil!" : "Oops!"}</h3>
      <p class="modal-message">${message}</p>
      <button class="modal-close-btn" type="button">OK</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Trigger animation
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);

  const closeBtn = modal.querySelector(".modal-close-btn");
  const closeModal = () => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
    }, 300);
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Auto close after 5 seconds
  setTimeout(closeModal, 5000);
};

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Mengirim...";

    try {
      const formData = new FormData(contactForm);

      // Send to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        createCustomModal(
          "success",
          "Terima kasih! Pesan Anda telah dikirim. Kami akan menghubungi Anda segera.",
        );
        contactForm.reset();
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      createCustomModal(
        "error",
        "Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
      );
    } finally {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// Smooth scroll behavior (already set in CSS, but fallback for older browsers)
if (!CSS.supports("scroll-behavior", "smooth")) {
  document.documentElement.style.scrollBehavior = "auto";
}

// Scroll animation - add animation class when element comes into view
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe service cards and stat items
document.querySelectorAll(".service-card, .stat-item").forEach((el) => {
  el.style.opacity = "0";
  observer.observe(el);
});

// Navbar scroll effect
const navbar = document.querySelector(".navbar");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 100) {
    navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  } else {
    navbar.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  }

  lastScrollTop = scrollTop;
});

// Performance: Lazy loading for images (if added in future)
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Add active class to nav links based on scroll position
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// Floating chatbot widget
const initChatbot = () => {
  if (document.querySelector(".chatbot-widget")) {
    return;
  }

  const widget = document.createElement("div");
  widget.className = "chatbot-widget";
  widget.innerHTML = `
    <button class="chatbot-toggle" aria-expanded="false" aria-controls="chatbot-panel" aria-label="Open chat">
      <svg class="icon-stroke" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    </button>
    <div class="chatbot-panel" id="chatbot-panel" role="dialog" aria-label="Chatbot Swarnadipa">
      <div class="chatbot-header">
        <div>
          <h4>Customer Service</h4>
        </div>
        <button class="chatbot-close" aria-label="Close">x</button>
      </div>
      <div class="chatbot-messages" aria-live="polite"></div>
      <form class="chatbot-input" autocomplete="off">
        <input type="text" name="message" placeholder="Type a message..." aria-label="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  `;

  document.body.appendChild(widget);

  const toggle = widget.querySelector(".chatbot-toggle");
  const panel = widget.querySelector(".chatbot-panel");
  const closeBtn = widget.querySelector(".chatbot-close");
  const form = widget.querySelector(".chatbot-input");
  const input = widget.querySelector(".chatbot-input input");
  const messages = widget.querySelector(".chatbot-messages");

  const addBubble = (text, type) => {
    const bubble = document.createElement("div");
    bubble.className = `chatbot-bubble ${type}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const clearOptions = () => {
    const existing = messages.querySelector(".chatbot-options");
    if (existing) {
      existing.remove();
    }
  };

  let hasOpenedGreeting = false;

  const openChat = () => {
    widget.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    if (!hasOpenedGreeting) {
      addBubble(
        "Hello! Welcome to PT Swarnadipa Rampai Teknologi's website. How can we help you?",
        "bot",
      );
      addOptions(defaultOptions);
      hasOpenedGreeting = true;
    }
    input.focus();
  };

  const closeChat = () => {
    widget.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    if (widget.classList.contains("open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener("click", closeChat);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && widget.classList.contains("open")) {
      closeChat();
    }
  });

  const solutionsList = [
    "Airport & Aviation Solutions",
    "Healthcare Solutions",
    "Education Solutions",
    "Data Centre Solutions",
    "Banking & Finance Solutions",
  ];

  const productCatalog = [
    {
      match: /global shutter camera/i,
      name: "GLOBAL SHUTTER CAMERA",
    },
    {
      match: /64mp body worn camera/i,
      name: "64MP BODY WORN CAMERA",
    },
    {
      match: /16ch embedded network video recorder/i,
      name: "16CH EMBEDDED NETWORK VIDEO RECORDER",
    },
    {
      match: /4mp ptz dome camera/i,
      name: "4MP PTZ DOME CAMERA",
    },
    {
      match: /adss multi-loose tube fibre optic cable/i,
      name: "ADSS MULTI-LOOSE TUBE FIBRE OPTIC CABLE",
    },
    {
      match: /high density fibre optic patch panel/i,
      name: "High Density Fibre Optic Patch Panel",
    },
    {
      match: /high density 1u loaded 48 port patch panel/i,
      name: "High Density 1U Loaded 48 Port Patch Panel",
    },
  ];

  const getReply = (message) => {
    const text = message.toLowerCase();

    if (/(^|\s)(hai|halo|hi|p)(\s|$)/i.test(text)) {
      return "How can we help you?";
    }

    if (/(oh|oh gitu|oke|ok|baik|sip|iya|yup|ya)/i.test(text)) {
      return null;
    }

    if (/(makasih|terima kasih|terimakasih|thanks|thank you)/i.test(text)) {
      return "You're welcome. Happy to help.";
    }

    if (/(perusahaan|company|tentang|siapa|what is)/i.test(text)) {
      return "PT. Swarnadipa Rampai Teknologi (SRT) is a technology solutions company established in June 2025, part of the Sriwjaya Teknik Group. We specialize in passive network infrastructure and IP ELV solutions, serving major projects across Indonesia. We are the official Representative Agency for global brands including Norden, Forteq, and Golden Pots, supporting industries such as Manufacturing, Aviation Maintenance, Oil and Gas, Mining, and Building Maintenance.";
    }

    if (/(solution|solusi)/i.test(text)) {
      return `Our solutions include: ${solutionsList.join(", ")}. Please check the Solution menu for details.`;
    }

    const matchedProduct = productCatalog.find((item) => item.match.test(text));
    if (matchedProduct) {
      return `Product available: ${matchedProduct.name}. Please check the Product & Datasheet menu for details.`;
    }

    if (
      /(product|produk|datasheet)/i.test(text) &&
      /(apa|list|katalog|daftar)/i.test(text)
    ) {
      return "Products are available in the Product & Datasheet menu.";
    }

    if (/(kontak|hubungi|contact|whatsapp|wa|telp|telepon)/i.test(text)) {
      return "Please contact Diaz Rakala Faturahman at +6281947693590 or email diazrakala.f@gmail.com.";
    }

    if (/(produk|product|datasheet)/i.test(text)) {
      return "Could you be more specific? Please mention the product name you're referring to.";
    }

    return "Sorry, I'm here to provide information only about PT Swarnadipa Rampai Teknologi.";
  };

  const getProductOptions = () => {
    const inPages = window.location.pathname.includes("/pages/");
    const prefix = inPages ? "" : "pages/";
    return [
      {
        label: "Surveillance System",
        url: `${prefix}product-SurveillanceSystem.html`,
      },
      { label: "Cabling System", url: `${prefix}product-CablingSystem.html` },
    ];
  };

  const inPages = window.location.pathname.includes("/pages/");
  const stockPrefix = inPages ? "" : "pages/";

  const defaultOptions = [
    { label: "About Company", query: "company" },
    { label: "Our Solutions", query: "solution" },
    { label: "Our Stock", url: `${stockPrefix}our-stock.html` },
    { label: "Contact", url: "https://wa.me/6281291243545" },
  ];

  const addOptions = (options) => {
    clearOptions();
    const wrapper = document.createElement("div");
    wrapper.className = "chatbot-options";

    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chatbot-option";
      button.textContent = option.label;
      button.addEventListener("click", () => {
        clearOptions();
        addBubble(option.label, "user");
        if (option.options) {
          if (option.reply) {
            addBubble(option.reply, "bot");
          }
          addOptions(option.options);
          return;
        }

        if (option.url) {
          window.location.href = option.url;
          return;
        }

        const reply = option.reply || getReply(option.query || option.label);
        if (reply) {
          setTimeout(() => {
            addBubble(reply, "bot");
            addOptions(defaultOptions);
          }, 400);
        } else {
          addOptions(defaultOptions);
        }
      });
      wrapper.appendChild(button);
    });

    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      return;
    }

    clearOptions();
    addBubble(value, "user");
    input.value = "";

    setTimeout(() => {
      const reply = getReply(value);
      const isProductList =
        /(product|produk|datasheet)/i.test(value) &&
        /(apa|list|katalog|daftar)/i.test(value);

      if (!reply) {
        addOptions(defaultOptions);
        return;
      }

      addBubble(reply, "bot");

      if (isProductList) {
        addOptions(getProductOptions());
        return;
      }

      addOptions(defaultOptions);
    }, 600);
  });
};

initChatbot();

// Page transition — intercept internal link clicks
document.addEventListener("click", function (e) {
  const link = e.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    link.target === "_blank"
  )
    return;
  e.preventDefault();
  document.body.classList.add("page-leaving");
  setTimeout(function () {
    window.location.href = href;
  }, 130);
});