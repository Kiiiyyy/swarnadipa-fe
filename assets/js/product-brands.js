class BrandLoader {
    constructor() {
        this.apiEndpoint = "http://localhost/swardipa-be/api/get_brands.php";
        this.apiKey = "Swarna_Secret_Key_2026_V1";
        
        // REVISI: Samakan dengan class di HTML lu (.brand-categories)
        this.container = document.querySelector(".brand-categories");
        
        // Pengecekan biar aman
        if (!this.container) {
            console.error("Kontainer .brand-categories gak ketemu pak! Cek HTML lu.");
            return;
        }
        
        this.init();
    }

    async init() {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    "Content-Type": "application/json"
                }
            });

            // Tambahin cek status 429 (Rate Limit) biar lu gak bingung
            if (response.status === 429) {
                this.container.innerHTML = "<p>Sabar pak, refreshnya kecepatan. Tunggu 1 menit.</p>";
                return;
            }

            const result = await response.json();

            if (result.success) {
                this.renderBrands(result.data);
            } else {
                console.error("Gagal load brand:", result.message);
            }
        } catch (error) {
            console.error("Error connection:", error);
        }
    }

    renderBrands(brands) {
        this.container.innerHTML = ""; 

        if (brands.length === 0) {
            this.container.innerHTML = "<p>Gak ada brand aktif pak.</p>";
            return;
        }

        brands.forEach(brand => {
            const card = document.createElement("a");
            card.href = `brand-detail.html?brand_id=${brand.id}`;
            card.className = "product-category-card";
            
            card.innerHTML = `
                <div class="card-content">
                    <h3>${brand.name}</h3>
                </div>
                <div class="card-image">
                    <img src="${brand.logo}" alt="${brand.name}" />
                </div>
            `;
            
            this.container.appendChild(card);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new BrandLoader();
});