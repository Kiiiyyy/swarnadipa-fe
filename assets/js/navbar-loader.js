class NavbarLoader {
  constructor() {
    this.apiEndpoint = "http://localhost/swardipa-be/api/get_brands.php";
    this.apiKey = "Swarna_Secret_Key_2026_V1";
    
    // Cek posisi file sekarang
    this.isInPages = window.location.pathname.includes("/pages/");
    this.prefix = this.isInPages ? "../" : ""; 
    this.partialPath = `${this.prefix}partials/navbar.html`;
    
    this.init();
  }

  async init() {
    try {
      const resp = await fetch(this.partialPath);
      if (!resp.ok) throw new Error("File navbar.html tidak ketemu");
      
      let html = await resp.text();

      // LOGIKA PENYESUAIAN PATH (REVISI TOTAL)
      if (!this.isInPages) {
        // Jika kita di ROOT (index.html):
        
        // 1. Link Home: ../index.html -> index.html
        html = html.replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
        
        // 2. Gambar & Asset: ../assets/ -> assets/
        html = html.replace(/src="\.\.\/assets\//g, 'src="assets/');
        
        // 3. Link Halaman di folder pages: company.html -> pages/company.html
        const pages = [
          "company.html", "solution.html", "product.html", 
          "references.html", "our-stock.html", "where-to-buy.html"
        ];
        pages.forEach(p => {
          const regex = new RegExp(`href="${p}"`, 'g');
          html = html.replace(regex, `href="pages/${p}"`);
        });
      }

      document.body.insertAdjacentHTML("afterbegin", html);

      // Load Brand Dropdown
      await this.loadBrands();

      // Aktifkan mobile menu (main.js)
      if (window.initMobileMenu) window.initMobileMenu();
      
      this.highlightActiveMenu();

    } catch (err) {
      console.error("Error loader:", err);
    }
  }

  async loadBrands() {
    const dropdown = document.getElementById("dynamicBrandDropdown");
    if (!dropdown) return;

    try {
      const response = await fetch(this.apiEndpoint, {
        headers: { "X-API-KEY": this.apiKey }
      });
      const result = await response.json();

      if (result.success) {
        // Prefix buat link brand di dropdown
        const linkPrefix = this.isInPages ? "" : "pages/";
        
        dropdown.innerHTML = `<li><a href="${linkPrefix}product.html">All Brands</a></li>`;
        result.data.forEach(brand => {
          dropdown.innerHTML += `<li><a href="${linkPrefix}brand-detail.html?brand_id=${brand.id}">${brand.name}</a></li>`;
        });
      }
    } catch (error) {
      console.error("Dropdown error:", error);
    }
  }

  highlightActiveMenu() {
    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || "index.html";
    
    const navLinks = {
      "index.html": "nav-home",
      "company.html": "nav-company",
      "solution.html": "nav-solution",
      "product.html": "nav-product",
      "brand-detail.html": "nav-product",
      "product-list.html": "nav-product",
      "product-detail.html": "nav-product",
      "references.html": "nav-portfolio",
      "our-stock.html": "nav-stock"
    };

    const activeId = navLinks[currentPage];
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) el.classList.add("active");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new NavbarLoader());