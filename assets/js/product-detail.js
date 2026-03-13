class ProductDetailLoader {
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get("id");

    this.apiEndpoint = `http://localhost/swardipa-be/api/get_product_detail.php?id=${this.productId}`;
    this.apiKey = "Swarna_Secret_Key_2026_V1";

    // Bind DOM Elements
    this.nameElem = document.querySelector(".product-detail-info h2");
    this.skuElem = document.querySelector(".product-detail-code");
    this.descElem = document.querySelector(".product-detail-desc");
    this.mainImg = document.querySelector(".product-detail-media img");
    this.datasheetBtn = document.querySelector(".btn-outline");
    this.datasheetPreview = document.querySelector(".product-datasheet-image img");
    this.datasheetSection = document.querySelector(".product-datasheet-section");
    this.pdfIframe = document.getElementById("pdfIframe");
    this.manualDownload = document.getElementById("manualDownload");

    if (!this.productId) {
      window.location.href = "product.html";
      return;
    }

    this.init();
  }

  async init() {
    try {
      const response = await fetch(this.apiEndpoint, {
        headers: { "X-API-KEY": this.apiKey },
      });
      const result = await response.json();

      if (result.success) {
        this.render(result.data);
      } else {
        alert(result.message);
        window.location.href = "product.html";
      }
    } catch (error) {
      console.error("Error loading product detail:", error);
    }
  }

  render(p) {
    // Update Title & Text
    document.title = `${p.name} - Swarnadipa`;
    this.nameElem.textContent = p.name;
    this.skuElem.textContent = p.sku;
    this.descElem.textContent = p.description || "No description available.";

    // Update Image
    this.mainImg.src = p.image;
    this.mainImg.alt = p.name;

    // Update Datasheet
    if (p.datasheet) {
        // Tampilkan section
        if (this.datasheetSection) this.datasheetSection.style.display = "block";
        
        // Set PDF ke Iframe. 
        // Tips: Tambahin '#toolbar=0' di ujung URL buat nyembunyiin menu bawaan browser biar rapi
        this.pdfIframe.src = p.datasheet + "#view=FitH&toolbar=0&navpanes=0";     
        // Set link download cadangan
        if (this.manualDownload) this.manualDownload.href = p.datasheet;
        if (this.datasheetBtn) this.datasheetBtn.href = p.datasheet;
        
        } else {
        if (this.datasheetSection) this.datasheetSection.style.display = "none";
        }
  }
}

document.addEventListener("DOMContentLoaded", () => new ProductDetailLoader());