// assets/js/env.js
const ENV = {
    BASE_URL: "http://localhost/swardipa-be/api",
    API_KEY: "Swarna_Secret_Key_2026_V1",
    PRODUCTION_MODE: false
};

// Bekukan objek agar tidak bisa diubah-ubah lewat konsol browser (Security tip)
Object.freeze(ENV);