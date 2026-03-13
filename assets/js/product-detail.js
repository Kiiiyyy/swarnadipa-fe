/**
 * Swarnadipa Product Detail Loader
 * Handles API data fetching and PDF.js Pagination Rendering
 */

class ProductDetailLoader {
  constructor() {
    // 1. Ambil ID dari URL
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get("id");

    // 2. Konfigurasi API (Pastikan ENV sudah di-load di HTML)
    this.apiEndpoint = `${ENV.BASE_URL}/get_product_detail.php?id=${this.productId}`;
    this.apiKey = ENV.API_KEY;
    // 3. Bind DOM Elements Detail Produk
    this.nameElem = document.querySelector(".product-detail-info h2");
    this.skuElem = document.querySelector(".product-detail-code");
    this.descElem = document.querySelector(".product-detail-desc");
    this.mainImg = document.querySelector(".product-detail-media img");
    this.datasheetBtn = document.querySelector(".btn-outline");
    this.datasheetSection = document.querySelector(".product-datasheet-section");
    this.manualDownload = document.getElementById("manualDownload");
    
    // 4. PDF.js State & Elements
    this.canvas = document.getElementById("pdf-render");
    this.ctx = (this.canvas) ? this.canvas.getContext("2d") : null;
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageNumPending = null;

    // 5. Jalankan Inisialisasi
    if (!this.productId) {
      window.location.href = "product.html";
      return;
    }
    
    this.init();
    this.setupPdfEvents();
  }

  /**
   * Mengambil data produk dari backend
   */
  async init() {
    try {
      const response = await fetch(this.apiEndpoint, {
        headers: { "X-API-KEY": this.apiKey },
      });
      const result = await response.json();

      if (result.success) {
        this.render(result.data);
      } else {
        console.error("API Error:", result.message);
        window.location.href = "product.html";
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  /**
   * Menampilkan data ke elemen HTML
   */
  render(p) {
    document.title = `${p.name} - Swarnadipa`;
    this.nameElem.textContent = p.name;
    this.skuElem.textContent = p.sku;
    this.descElem.textContent = p.description || "No description available.";
    this.mainImg.src = p.image;
    this.mainImg.alt = p.name;

    if (p.datasheet) {
      this.datasheetSection.style.display = "block";
      this.manualDownload.href = p.datasheet;
      this.datasheetBtn.href = p.datasheet;
      
      // Load PDF.js
      this.loadPDF(p.datasheet);
    } else {
      this.datasheetSection.style.display = "none";
    }
  }

  /**
   * Konfigurasi PDF.js dan Load Dokumen
   */
  loadPDF(url) {
    // Setup Worker CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
      this.pdfDoc = pdfDoc_;
      document.getElementById('page-count').textContent = this.pdfDoc.numPages;
      
      // Render halaman pertama
      this.renderPage(this.pageNum);
    }).catch(err => {
      console.error("PDF.js Error:", err);
      const container = document.querySelector('.pdf-preview-container');
      if (container) container.innerHTML = `<p style="padding:20px; color:white;">Gagal memuat pratinjau PDF.</p>`;
    });
  }

  /**
   * Logic Rendering Halaman PDF ke Canvas
   */
  renderPage(num) {
    this.pageRendering = true;
    
    this.pdfDoc.getPage(num).then(page => {
      // Hitung skala otomatis biar Fit-To-Width kontainer
      const containerWidth = document.querySelector('.pdf-preview-container').clientWidth;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = (containerWidth) / unscaledViewport.width;
      const viewport = page.getViewport({ scale: scale });

      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      const renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
      });
    });

    // Update nomor halaman di UI
    const pageNumEl = document.getElementById('page-num');
    if (pageNumEl) pageNumEl.textContent = num;
  }

  /**
   * Menangani antrian render (biar gak bentrok pas klik cepet)
   */
  queueRenderPage(num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }

  /**
   * Navigasi Halaman
   */
  onPrevPage() {
    if (this.pageNum <= 1) return;
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  onNextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) return;
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Listener tombol navigasi
   */
  setupPdfEvents() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) prevBtn.addEventListener('click', () => this.onPrevPage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.onNextPage());
  }
}

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  new ProductDetailLoader();
});