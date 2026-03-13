class BrandDetailLoader {
    constructor() {
        // Ambil brand_id dari URL (?brand_id=1)
        const urlParams = new URLSearchParams(window.location.search);
        this.brandId = urlParams.get('brand_id');
        
        this.apiEndpoint = `http://localhost/swardipa-be/api/get_brand_details.php?brand_id=${this.brandId}`;
        this.apiKey = "Swarna_Secret_Key_2026_V1";
        
        this.heading = document.querySelector(".product-section-heading h2");
        this.subHeading = document.querySelector(".product-section-heading p");
        this.container = document.querySelector(".product-categories");

        if (!this.brandId) {
            window.location.href = "product.html";
            return;
        }

        this.init();
    }

    async init() {
        try {
            const response = await fetch(this.apiEndpoint, {
                headers: { "X-API-KEY": this.apiKey }
            });
            const result = await response.json();

            if (result.success) {
                this.render(result);
            } else {
                this.container.innerHTML = `<p>${result.message}</p>`;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    render(result) {
        // Update Title & Heading
        document.title = `${result.brand_name} - Swarnadipa`;
        this.heading.textContent = `Choose Product Type`;
        this.subHeading.textContent = `Select the ${result.brand_name} product category you want to view.`;

        this.container.innerHTML = "";
        
        if (result.data.length === 0) {
            this.container.innerHTML = "<p>No categories found for this brand.</p>";
            return;
        }

        result.data.forEach(cat => {
            const card = document.createElement("a");
            // Nanti lari ke list produk berdasarkan Brand & Kategori
            card.href = `product-list.html?brand_id=${this.brandId}&cat_id=${cat.id}`;
            card.className = "product-category-card";

            card.innerHTML = `
                <div class="card-content">
                    <h3>${cat.name}</h3>
                </div>
                <div class="card-image">
                    <img src="../assets/images/${cat.slug}.png" onerror="this.src='../assets/images/logo.png'" alt="${cat.name}" />
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new BrandDetailLoader());