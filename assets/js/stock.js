/**
 * Swarnadipa Stock Inventory Management (Updated for PHP Native API)
 */

class StockInventory {
  constructor() {
    // ===== CONFIGURATION =====
    // Endpoint API Native PHP
    this.apiEndpoint = "http://localhost/swardipa-be/api/get_products.php"; 
    // API Key sesuai yang kita buat di backend
    this.apiKey = "Swarna_Secret_Key_2026_V1"; 
    this.timeout = 10000; 

    // ===== Data Storage =====
    this.allData = []; 
    this.filteredData = []; 
    this.currentBrand = "all"; 
    this.searchQuery = ""; 

    // ===== DOM Elements =====
    this.loadingState = document.getElementById("loadingState");
    this.tableContainer = document.getElementById("tableContainer");
    this.emptyState = document.getElementById("emptyState");
    this.errorState = document.getElementById("errorState");
    this.stockTableBody = document.getElementById("stockTableBody");
    this.errorMessage = document.getElementById("errorMessage");
    this.retryButton = document.getElementById("retryButton");
    this.filterSection = document.getElementById("filterSection");
    this.searchInput = document.getElementById("searchInput");
    this.filterButtons = document.querySelectorAll(".filter-btn");

    // ===== Event Listeners =====
    if (this.retryButton) {
      this.retryButton.addEventListener("click", () => this.loadStockData());
    }

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterButtons.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentBrand = e.target.dataset.brand;
        this.applyFilters();
      });
    });

    // ===== Initialize =====
    this.loadStockData();
  }

  /**
   * Fetch data dari API Backend
   */
  async loadStockData() {
    try {
      this.showLoading();

      // Sekali hit ke API Tunggal (Lebih Cepat!)
      const response = await this.fetchWithTimeout(this.apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-API-KEY": this.apiKey // Kirim Kunci Keamanan
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("API Key Invalid atau Tidak Terkirim.");
        if (response.status === 429) throw new Error("Terlalu banyak permintaan (Rate Limit).");
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error(result.message || "Gagal mengambil data dari server.");
      }

      this.allData = result.data;

      if (this.allData.length === 0) {
        this.showEmpty();
        return;
      }

      // Default Filter & Render
      this.filteredData = [...this.allData];
      if (this.filterSection) this.filterSection.style.display = "block";

      this.renderTable(this.filteredData);
      this.showTable();

    } catch (error) {
      console.error("Fetch Error:", error);
      this.showError(error.message);
    }
  }

  fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
  }

  renderTable(data) {
    this.stockTableBody.innerHTML = "";

    if (data.length === 0) {
      this.stockTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #888;">No products match your criteria</td></tr>`;
      return;
    }

    data.forEach((row, index) => {
      const tr = document.createElement("tr");
      
      // Menggunakan mapping key yang sudah kita buat di PHP tadi
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${this.escapeHtml(row.product_name)}</td>
        <td><strong>${this.escapeHtml(row.brand)}</strong></td>
        <td><code>${this.escapeHtml(row.sku)}</code></td>
        <td>${this.escapeHtml(row.category)}</td>
        <td>${this.getStockBadge(row.stock_status)}</td>
        <td>${this.formatDate(row.updated_date)}</td>
        <td>${this.getDatasheetLink(row.datasheet_url)}</td>
      `;
      this.stockTableBody.appendChild(tr);
    });
  }

  getDatasheetLink(url) {
    if (url) {
      return `<a href="${url}" target="_blank" class="datasheet-link">📄 Download</a>`;
    }
    return '<span style="color: #ccc;">N/A</span>';
  }

  applyFilters() {
    let filtered = [...this.allData];

    if (this.currentBrand !== "all") {
      filtered = filtered.filter(item => 
        item.brand && item.brand.toLowerCase() === this.currentBrand.toLowerCase()
      );
    }

    if (this.searchQuery) {
      filtered = filtered.filter(item => 
        (item.product_name || "").toLowerCase().includes(this.searchQuery) ||
        (item.sku || "").toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredData = filtered;
    this.renderTable(this.filteredData);
  }

  getStockBadge(status) {
    const statusMap = {
      in_stock: { class: "in", text: "In Stock" },
      low_stock: { class: "low", text: "Low Stock" },
      out_of_stock: { class: "out", text: "Sold Out" }
    };

    const info = statusMap[status] || { class: "out", text: "N/A" };
    return `<span class="stock-badge ${info.class}">${info.text}</span>`;
  }

  formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showLoading() { this.loadingState.style.display = "flex"; this.tableContainer.style.display = "none"; this.emptyState.style.display = "none"; this.errorState.style.display = "none"; }
  showTable() { this.loadingState.style.display = "none"; this.tableContainer.style.display = "block"; this.emptyState.style.display = "none"; this.errorState.style.display = "none"; }
  showEmpty() { this.loadingState.style.display = "none"; this.tableContainer.style.display = "none"; this.emptyState.style.display = "flex"; this.errorState.style.display = "none"; }
  showError(msg) { 
    this.loadingState.style.display = "none"; this.tableContainer.style.display = "none"; this.errorState.style.display = "flex";
    if (this.errorMessage) this.errorMessage.textContent = msg || "An error occurred.";
  }
}

document.addEventListener("DOMContentLoaded", () => { new StockInventory(); });