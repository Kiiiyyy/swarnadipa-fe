/**
 * Swarnadipa Brand Detail Loader
 * Menampilkan daftar kategori produk berdasarkan Brand yang dipilih
 */

class BrandDetailLoader {
    constructor() {
        // 1. Ambil brand_id dari URL (?brand_id=X)
        const urlParams = new URLSearchParams(window.location.search);
        this.brandId = urlParams.get('brand_id');
        
        // 2. Gunakan config dari ENV (pastikan config.js / env.js sudah di-load di HTML)
        // Jika belum pake ENV, ganti kembali ke string manual
        this.apiEndpoint = `${ENV.BASE_URL}/get_brand_details.php?brand_id=${this.brandId}`;
        this.apiKey = ENV.API_KEY;
        
        // 3. Bind DOM Elements
        this.heading = document.querySelector(".product-section-heading h2");
        this.subHeading = document.querySelector(".product-section-heading p");
        this.container = document.querySelector(".product-categories");

        // 4. Proteksi jika ID tidak ada
        if (!this.brandId) {
            window.location.href = "product.html";
            return;
        }

        this.init();
    }

    /**
     * Fetch data dari API
     */
    async init() {
        try {
            // Tambahkan header ngrok jika lu lagi pake tunnel buat testing
            const response = await fetch(this.apiEndpoint, {
                headers: { 
                    "X-API-KEY": this.apiKey,
                    "ngrok-skip-browser-warning": "69420" // Skip warning ngrok
                }
            });
            const result = await response.json();

            if (result.success) {
                this.render(result);
            } else {
                this.container.innerHTML = `<div class="error-msg"><p>${result.message}</p></div>`;
            }
        } catch (error) {
            console.error("Error loading brand details:", error);
            this.container.innerHTML = `<p>Gagal memuat data. Periksa koneksi ke server.</p>`;
        }
    }

    /**
     * Render data ke dalam HTML
     */
    render(result) {
        // Update Meta Title & Header Teks
        document.title = `${result.brand_name} - Swarnadipa`;
        
        if (this.heading) this.heading.textContent = `Choose Product Type`;
        if (this.subHeading) {
            this.subHeading.textContent = `Select the ${result.brand_name} product category you want to view.`;
        }

        this.container.innerHTML = "";
        
        if (!result.data || result.data.length === 0) {
            this.container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">No categories found for this brand.</p>
                </div>`;
            return;
        }

        // Loop data kategori
        result.data.forEach(cat => {
            const card = document.createElement("a");
            // Link ke halaman daftar produk dengan filter Brand & Category
            card.href = `product-list.html?brand_id=${this.brandId}&cat_id=${cat.id}`;
            card.className = "product-category-card";

            // Default logo jika dari API null
            const displayLogo = cat.logo ? cat.logo : '../assets/images/default-icon.png';

            card.innerHTML = `
                <div class="card-content">
                    <h3>${cat.name}</h3>
                </div>
                <div class="card-image">
                    <img src="${displayLogo}" 
                         onerror="this.src='../assets/images/logo.png'" 
                         alt="${cat.name}" />
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}

// Jalankan saat halaman siap
document.addEventListener("DOMContentLoaded", () => new BrandDetailLoader());