class ProductDetailLoader {
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get("id");

    // Tetap panggil dari ENV/Config lu pak
    this.apiEndpoint = `http://localhost/swardipa-be/api/get_product_detail.php?id=${this.productId}`;
    this.apiKey = "Swarna_Secret_Key_2026_V1";

    this.nameElem = document.querySelector(".product-detail-info h2");
    this.skuElem = document.querySelector(".product-detail-code");
    this.descElem = document.querySelector(".product-detail-desc");
    this.mainImg = document.querySelector(".product-detail-media img");
    this.datasheetBtn = document.querySelector(".btn-outline");
    this.datasheetSection = document.querySelector(".product-datasheet-section");
    this.manualDownload = document.getElementById("manualDownload");
    
    // PDF.js Elements
    this.canvas = document.getElementById("pdf-render");
    this.ctx = this.canvas.getContext("2d");
    this.loader = document.getElementById("pdf-loader");

    if (!this.productId) { window.location.href = "product.html"; return; }
    this.init();
  }

  async init() {
    try {
      const response = await fetch(this.apiEndpoint, { headers: { "X-API-KEY": this.apiKey } });
      const result = await response.json();
      if (result.success) { this.render(result.data); }
    } catch (error) { console.error("Error:", error); }
  }

  render(p) {
    document.title = `${p.name} - Swarnadipa`;
    this.nameElem.textContent = p.name;
    this.skuElem.textContent = p.sku;
    this.descElem.textContent = p.description || "No description available.";
    this.mainImg.src = p.image;

    if (p.datasheet) {
        this.datasheetSection.style.display = "block";
        this.manualDownload.href = p.datasheet;
        this.datasheetBtn.href = p.datasheet;
        
        // JALANKAN RENDER PDF.js
        this.loadPDF(p.datasheet);
    } else {
        this.datasheetSection.style.display = "none";
    }
  }

  loadPDF(url) {
    // Setup Worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Ambil dokumen
    pdfjsLib.getDocument(url).promise.then(pdf => {
      // Kita render halaman pertama saja untuk pratinjau
      pdf.getPage(1).then(page => {
        const containerWidth = document.querySelector('.pdf-preview-container').clientWidth;
        
        // Hitung skala otomatis biar Fit-To-Width
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: scale });

        // Set ukuran canvas (biar tajem/HD)
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;

        const renderContext = {
          canvasContext: this.ctx,
          viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
          this.loader.style.display = "none"; // Hilangkan tulisan loading
          console.log("PDF Rendered successfully");
        });
      });
    }).catch(err => {
      this.loader.innerHTML = "<p>Failed to load PDF preview.</p>";
      console.error("PDF.js Error:", err);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new ProductDetailLoader());