<div align="center">

  # 🚀 Irvan Afriandi - Interactive Developer Portfolio

  <p align="center">
    <b>Portofolio Interaktif Web Developer & Frontend Engineer dari Cirebon, Indonesia.</b>
  </p>

  [![Website](https://img.shields.io/badge/Website-rikorizky.my.id-ff8c38?style=for-the-badge&logo=googlechrome&logoColor=white)](https://rikorizky.my.id/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://rikorizky.my.id/)

</div>

---

## 📌 Tentang Proyek

Website ini adalah portofolio interaktif resmi **Irvan Afriandi** yang dirancang untuk menampilkan karya proyek *web development*, keahlian teknis, sertifikasi profesional (BNSP), dan pengalaman kerja dengan performa tinggi (60 FPS) serta desain modern yang responsif di seluruh perangkat.

🌐 **Live URL**: [https://rikorizky.my.id/](https://rikorizky.my.id/)

---

## ✨ Fitur Utama

- ⚡ **Animasi & Interaksi Responsif**: Menggunakan GSAP & ScrollTrigger untuk efek parallax hero, pinned timeline, dan transisi smooth.
- 🎨 **Galeri Karya & Proyek Interactive**: Carousel proyek interaktif dengan fitur preview cepat, filter kategori, dan direct project links.
- 💼 **Timeline Pengalaman Profesional**: Highlight sertifikasi BNSP Teknologi Informasi, pengalaman magang BPS Cirebon, dan UKK RPL.
- 🚀 **Performa Teroptimasi (60 FPS)**:
  - Ukuran gambar terkompresi optimal (**turun 85% dari 24.6 MB ke 3.5 MB**).
  - Akselerasi GPU layer (`will-change: transform`, `transform: translateZ(0)`).
  - Event listener throttled dengan `requestAnimationFrame` dan *debounced resize*.
- 🔍 **SEO & Google Search Ready**:
  - OpenGraph & Meta Tags lengkap untuk WhatsApp/Social Media preview.
  - JSON-LD Structured Data (Schema.org Person & WebSite).
  - Terintegrasi Schema `SiteNavigationElement` untuk **Google Sitelinks**.

---

## 🛠️ Teknologi & Tools

| Kategori | Teknologi yang Digunakan |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite) |
| **Styling & Design** | Vanilla CSS, Glassmorphism, Modern Layouts, Tailwind CSS |
| **Animation Engine** | GSAP 3 (GreenSock), ScrollTrigger |
| **Routing** | React Router DOM v7 |
| **Optimization** | Async Image Decoding, Lazy Loading, GPU Hardware Acceleration |
| **Deployment & Hosting** | Vercel |

---

## 📁 Struktur Direktori

```text
NewPorto/
├── public/                  # Static Assets & Images (Optimized)
│   ├── img/                 # Gambar Karya, Sertifikat, & Profil
│   ├── LandingPage.png      # Hero Preview Image (SEO / OpenGraph)
│   ├── robots.txt           # Robot Crawler Directives
│   └── sitemap.xml          # XML Sitemap untuk Google Indexing
├── src/
│   ├── components/          # Komponen UI Portofolio
│   │   ├── LandingPage.jsx  # Hero Section dengan Parallax Effect
│   │   ├── AboutSection.jsx # Biodata & Skill Matrix
│   │   ├── ProfessionalBackgroundSection.jsx # Pinned Timeline
│   │   ├── Karya.jsx        # Project Carousel & Showcase
│   │   ├── Navbar.jsx       # Responsive Smart Navbar
│   │   ├── ContactSection.jsx # Form Kontak & Social Links
│   │   ├── FeedbackSection.jsx # User Feedback Form
│   │   └── Footer.jsx       # Footer Section
│   ├── styles/              # Global Styles & Backdrop Effects
│   ├── App.jsx              # Main Application & Router Setup
│   └── main.jsx             # Entrypoint React
├── index.html               # Main HTML, SEO Meta Tags & Schema.org
├── package.json             # Project Dependencies & Scripts
└── vite.config.js           # Vite Configuration
```

---

## 🚀 Panduan Jalankan Secara Lokal

### Prerequisites
Pastikan Anda sudah menginstal Node.js (v18+) dan npm.

### Langkah-Langkah:

1. **Clone Repositori ini:**
   ```bash
   git clone https://github.com/RikoRizky/NewPorto.git
   cd NewPorto
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Dev Server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

4. **Build untuk Produksi:**
   ```bash
   npm run build
   ```

---

## 📬 Kontak & Sosial Media

- **Website**: [rikorizky.my.id](https://rikorizky.my.id/)
- **GitHub**: [@rikorizky](https://github.com/rikorizky)
- **Instagram**: [@sir_ikoo](https://instagram.com/sir_ikoo)

---

<div align="center">
  <p>Dikembangkan dengan oleh <b>Irvan Afriandi</b></p>
</div>
