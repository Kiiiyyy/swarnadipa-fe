class ProductListLoader {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        this.brandId = urlParams.get('brand_id');
        this.catId = urlParams.get('cat_id');
        
        this.apiEndpoint = `http://localhost/swardipa-be/api/get_product_list.php?brand_id=${this.brandId}&cat_id=${this.catId}`;
        this.apiKey = "Swarna_Secret_Key_2026_V1";
        
        this.container = document.getElementById("productsList");
        this.titleTag = document.querySelector("title");
        this.searchInput = document.getElementById("productSearchInput");
        
        this.allProducts = []; // Simpan master data buat search

        this.init();
    }

    async init() {
        if (!this.brandId || !this.catId) {
            window.location.href = "product.html";
            return;
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                headers: { "X-API-KEY": this.apiKey }
            });
            const result = await response.json();

            if (result.success) {
                this.allProducts = result.data;
                this.titleTag.textContent = `${result.brand_name} ${result.category_name} - Swarnadipa`;
                this.render(this.allProducts);
                this.setupSearch();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    render(products) {
        this.container.innerHTML = "";
        
        if (products.length === 0) {
            this.container.innerHTML = "<p>No products found in this category.</p>";
            return;
        }

        products.forEach(p => {
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
                ${p.datasheet ? 
                    `<a href="${p.datasheet}" download class="btn btn-datasheet">Datasheet</a>` : 
                    `<button class="btn btn-datasheet" disabled style="opacity:0.5; cursor:not-allowed">No Datasheet</button>`
                }
            `;
            this.container.appendChild(item);
        });
    }

    setupSearch() {
        this.searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = this.allProducts.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.sku.toLowerCase().includes(query)
            );
            this.render(filtered);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new ProductListLoader());