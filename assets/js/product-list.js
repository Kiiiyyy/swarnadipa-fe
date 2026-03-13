class ProductListLoader {
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.brandId = urlParams.get("brand_id");
    this.catId = urlParams.get("cat_id");

    this.apiEndpoint = `${ENV.BASE_URL}/get_product_list.php?brand_id=${this.brandId}&cat_id=${this.catId}`;
    this.apiKey = ENV.API_KEY;

    this.container = document.getElementById("productsList");
    this.titleTag = document.querySelector("title");
    this.searchInput = document.getElementById("productSearchInput");
    this.sortSelect = document.getElementById("productSortSelect");

    this.allProducts = []; // Simpan master data buat search
    this.searchQuery = "";
    this.sortOrder = "az";

    this.init();
  }

  async init() {
    if (!this.brandId || !this.catId) {
      window.location.href = "product.html";
      return;
    }

    try {
      const response = await fetch(this.apiEndpoint, {
        headers: { "X-API-KEY": this.apiKey },
      });
      const result = await response.json();

      if (result.success) {
        this.allProducts = result.data;
        this.titleTag.textContent = `${result.brand_name} ${result.category_name} - Swarnadipa`;
        this.applyAndRender();
        this.setupSearch();
        this.setupSort();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  getSortedProducts(products) {
    const sorted = [...products];
    sorted.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      if (this.sortOrder === "za") {
        return nameB.localeCompare(nameA);
      }
      return nameA.localeCompare(nameB);
    });
    return sorted;
  }

  applyAndRender() {
    const filtered = this.allProducts.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(this.searchQuery) ||
        (p.sku || "").toLowerCase().includes(this.searchQuery),
    );

    this.render(this.getSortedProducts(filtered));
  }

  render(products) {
    this.container.innerHTML = "";

    if (products.length === 0) {
      this.container.innerHTML = "<p>No products found in this category.</p>";
      return;
    }

    products.forEach((p) => {
      const item = document.createElement("div");
      item.className = "product-item";

      // Link ke detail produk bawa ID
      item.innerHTML = `
                <a class="product-item-link" href="product-detail.html?id=${p.id}">
                    <div class="product-item-image">
                        <img src="${p.image}" alt="${p.name}" />
                    </div>
                    <h3>${p.name}</h3>
                    <h5>${p.sku}</h5>
                </a>
                ${
                  p.datasheet
                    ? `<a href="${p.datasheet}" download class="btn btn-datasheet">Datasheet</a>`
                    : `<button class="btn btn-datasheet" disabled style="opacity:0.5; cursor:not-allowed">No Datasheet</button>`
                }
            `;
      this.container.appendChild(item);
    });
  }

  setupSearch() {
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.applyAndRender();
    });
  }

  setupSort() {
    if (!this.sortSelect) {
      return;
    }

    this.sortSelect.addEventListener("change", (e) => {
      this.sortOrder = e.target.value;
      this.applyAndRender();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new ProductListLoader());
