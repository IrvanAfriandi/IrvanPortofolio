import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';

export const SLIDE_DATA = [
  {
    name: "BYD Cirebon",
    img: "/img/byd.webp",
    link: "https://bydcirebon.id/",
    category: "Automotive Dealer",
    description: "Website dealer dengan katalog kendaraan dan pengalaman showroom digital.",
    tags: ["React", "Vite", "Tailwind"],
    detail: {
      fullDescription: "Website resmi dealer BYD Cirebon yang menampilkan katalog kendaraan listrik secara modern dan interaktif. Dirancang untuk memberikan pengalaman showroom digital yang imersif bagi calon pembeli, lengkap dengan tampilan produk, spesifikasi teknis, serta kemudahan menghubungi tim sales.",
      highlights: [
        "Katalog kendaraan interaktif dengan filter dan detail spesifikasi",
        "Desain responsif & animasi halus untuk pengalaman premium",
        "Integrasi formulir kontak dan WhatsApp langsung",
        "Performa optimal dengan lazy loading & WebP image",
      ],
      images: ["/img/byd.webp"],
    }
  },
  {
    name: "Mariposas Tour",
    img: "/img/mariposas.webp",
    link: "https://mariposasindonesia.com",
    category: "Travel & Tourism",
    description: "Platform perjalanan untuk menjelajahi destinasi Indonesia dengan lebih mudah.",
    tags: ["React", "GSAP", "Vercel"],
    detail: {
      fullDescription: "Mariposas Tour adalah platform digital untuk agen perjalanan wisata Indonesia. Menampilkan paket tur, destinasi populer, dan galeri foto wisata dengan animasi GSAP yang memukau. Dibangun di atas React + Vite dan di-deploy di Vercel untuk kecepatan loading yang optimal.",
      highlights: [
        "Halaman destinasi dengan animasi scroll parallax berbasis GSAP",
        "Galeri foto perjalanan yang imersif dan mobile-friendly",
        "Tampilan paket tur lengkap dengan harga dan jadwal",
        "Deploy otomatis via Vercel dengan performa CDN global",
      ],
      images: ["/img/mariposas.webp"],
    }
  },
  {
    name: "SILADATA",
    img: "/img/siladata.webp",
    link: "https://siladata.my.id",
    category: "Data Management",
    description: "Sistem pengelolaan dokumen akreditasi yang terpusat dan terstruktur.",
    tags: ["Web App", "PHP", "MySQL"],
    detail: {
      fullDescription: "SILADATA (Sistem Layanan Dokumen Akreditasi) adalah aplikasi web fullstack untuk manajemen dokumen akreditasi institusi pendidikan. Sistem ini telah mendapatkan pengakuan resmi berupa Hak Kekayaan Intelektual (HKI) dari Kementerian Hukum & HAM RI, membuktikan inovasi dan orisinalitasnya.",
      highlights: [
        "Manajemen dokumen akreditasi terpusat & terstruktur",
        "Sistem autentikasi role-based (admin, operator, viewer)",
        "Fitur upload, pencarian, dan export dokumen",
        "Terdaftar resmi di HKI Kemenkumham RI (2026)",
      ],
      images: ["/img/siladata.webp"],
    }
  },
];

const TOTAL = SLIDE_DATA.length;
let activeIdx = 1;
let isAnimating = false;
let autoSlideInterval = null;
let titleAnimationTimer = null;

export default function Karya() {
  const sliderRef = useRef(null);
  const titleDivRef = useRef(null);
  const captionDivRef = useRef(null);
  const previewDivRef = useRef(null);
  const prevArrowRef = useRef(null);
  const nextArrowRef = useRef(null);
  const modalRef = useRef(null);

  const [modalProject, setModalProject] = useState(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  const openModal = useCallback((project) => {
    setModalProject(project);
    setGalleryIdx(0);
    clearInterval(autoSlideInterval);
    // Freeze background scroll WITHOUT jump: save current position and pin body
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = scrollY;
  }, []);

  const closeModal = useCallback(() => {
    setModalProject(null);
    // Restore background scroll position
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    delete document.body.dataset.scrollY;
    window.scrollTo(0, scrollY);
    startAutoSlide();
  }, []);

  const getIndex = useCallback((offset) => {
    let newIdx = activeIdx + offset;
    while (newIdx < 1) newIdx += TOTAL;
    while (newIdx > TOTAL) newIdx -= TOTAL;
    return newIdx;
  }, []);

  const clearTitleTimer = () => {
    if (titleAnimationTimer) clearTimeout(titleAnimationTimer);
    titleAnimationTimer = null;
  };

  const animateTitleToCaption = () => {};

  const updatePreview = (content) => {
    if (!previewDivRef.current) return;
    const newImg = document.createElement('img');
    newImg.src = content.img;
    newImg.alt = content.name;
    previewDivRef.current.appendChild(newImg);
    gsap.fromTo(newImg,
      { opacity: 0, scale: 1.15 },
      {
        opacity: 1, scale: 1, duration: 1.5, ease: "power2.out", delay: 0.2,
        onComplete: () => {
          const old = previewDivRef.current.querySelector('img:not(:last-child)');
          if (old) old.remove();
        }
      }
    );
  };

  const createSlide = (content, className) => {
    const div = document.createElement('div');
    div.className = `karya-slide-container ${className}`;
    div.dataset.projectName = content.name;
    const tagsHtml = content.tags ? content.tags.map(t => `<span class="karya-card-tag">${t}</span>`).join('') : '';
    const categoryHtml = content.category ? `<span class="karya-card-category">${content.category}</span>` : '';

    div.innerHTML = `
      <div class="karya-slide-img">
        <img src="${content.img}" alt="${content.name}" loading="lazy" decoding="async">
        <div class="karya-card-gradient"></div>
        <div class="karya-card-top-info">${categoryHtml}</div>
        <div class="karya-card-bottom-info">
          <p class="karya-card-description">${content.description || ''}</p>
          <div class="karya-card-tags">${tagsHtml}</div>
          <div class="karya-card-actions">
            <button class="karya-card-detail-btn" data-project="${content.name}" aria-label="Lihat detail ${content.name}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span>Lihat Detail</span>
            </button>
            <a class="karya-card-link-badge" href="${content.link}" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi ${content.name}">
              <span>Visit</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    `;
    return div;
  };

  const transitionDesktop = (direction) => {
    if (isAnimating) return;
    isAnimating = true;

    const outPos = direction === 'next' ? 'prev' : 'next';
    const inPos = direction === 'next' ? 'next' : 'prev';

    let outSlide = sliderRef.current.querySelector(`.karya-slide-container.${outPos}`);
    const activeSlide = sliderRef.current.querySelector('.karya-slide-container.active');
    let inSlide = sliderRef.current.querySelector(`.karya-slide-container.${inPos}`);

    const inIdx = getIndex(direction === 'next' ? 1 : -1);
    if (!inSlide) {
      inSlide = createSlide(SLIDE_DATA[inIdx - 1], inPos);
      sliderRef.current.appendChild(inSlide);
      const startLeft = (inPos === 'prev') ? '10%' : '90%';
      gsap.set(inSlide, { top: '50%', left: startLeft, width: '46%', height: '56%', scale: 0.52, rotateY: 0, z: 0, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
    }
    if (!outSlide) {
      const outIdx = getIndex(direction === 'next' ? -1 : 1);
      outSlide = createSlide(SLIDE_DATA[outIdx - 1], outPos);
      sliderRef.current.appendChild(outSlide);
      const startLeft = (outPos === 'prev') ? '10%' : '90%';
      gsap.set(outSlide, { top: '50%', left: startLeft, width: '46%', height: '56%', scale: 0.52, rotateY: 0, z: 0, opacity: 1, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
    }

    const animDuration = 0.85;
    const animEase = "power2.inOut";
    const incomingLeft = inPos === 'prev' ? '10%' : '90%';
    const outgoingLeft = outPos === 'prev' ? '10%' : '90%';

    // Move the side preview into the center while shrinking the old center card.
    gsap.set(inSlide, {
      top: '50%',
      left: incomingLeft,
      width: '46%',
      height: '56%',
      scale: 0.52,
      opacity: 0.85,
      zIndex: 20
    });
    gsap.to(inSlide, {
      left: '50%',
      top: '56%',
      width: '46%',
      height: '56%',
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      zIndex: 20,
      clipPath: 'none',
      duration: animDuration, ease: animEase
    });

    // Inner image parallax zoom effect
    const inImg = inSlide.querySelector('.karya-slide-img img');
    if (inImg) {
      gsap.fromTo(inImg, { scale: 1.18 }, { scale: 1, duration: animDuration, ease: animEase });
    }

    // Return the old center card to the side preview position.
    gsap.to(activeSlide, {
      top: '50%',
      left: outgoingLeft,
      scale: 0.52,
      opacity: 0.85,
      filter: "brightness(0.8)",
      zIndex: 10,
      clipPath: 'none',
      duration: animDuration, ease: animEase
    });

    // Fade the old side preview while it is recycled.
    gsap.to(outSlide, {
      opacity: 0,
      duration: animDuration, ease: animEase
    });

    // 4. Prepare and animate new side slide entering (Offscreen -> Side)
    const farIdx = getIndex(direction === 'next' ? 2 : -2);
    const newSlide = createSlide(SLIDE_DATA[farIdx - 1], inPos);
    sliderRef.current.appendChild(newSlide);
    const newStartLeft = (inPos === 'prev') ? '10%' : '90%';
    gsap.set(newSlide, {
      top: '50%',
      left: newStartLeft,
      width: '46%',
      height: '56%',
      scale: 0.52,
      opacity: 0,
      filter: "brightness(0.8)",
      zIndex: 5,
      clipPath: 'none'
    });
    gsap.to(newSlide, {
      opacity: 0.85,
      zIndex: 10,
      duration: animDuration, ease: animEase
    });

    setTimeout(() => {
      outSlide?.remove();
      activeSlide.className = `karya-slide-container ${outPos}`;
      inSlide.className = 'karya-slide-container active';
      newSlide.className = `karya-slide-container ${inPos}`;
        gsap.set('.karya-slide-container.prev', { top: '50%', left: '10%', width: '46%', height: '56%', scale: 0.52, rotateY: 0, rotation: 0, skewX: 0, skewY: 0, z: 0, opacity: 0.85, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
        gsap.set('.karya-slide-container.active', { top: '56%', left: '50%', width: '46%', height: '56%', scale: 1, rotateY: 0, rotation: 0, skewX: 0, skewY: 0, z: 0, opacity: 1, filter: "brightness(1)", zIndex: 20, clipPath: 'none' });
        gsap.set('.karya-slide-container.next', { top: '50%', left: '90%', width: '46%', height: '56%', scale: 0.52, rotateY: 0, rotation: 0, skewX: 0, skewY: 0, z: 0, opacity: 0.85, filter: "brightness(0.8)", zIndex: 10, clipPath: 'none' });
      activeIdx = inIdx;
      isAnimating = false;
      animateTitleToCaption(SLIDE_DATA[activeIdx - 1].name);
      updatePreview(SLIDE_DATA[activeIdx - 1]);
    }, animDuration * 1000 + 40);
  };

  const transitionMobile = (direction) => {
    if (isAnimating) return;
    isAnimating = true;
    const newIdx = getIndex(direction === 'next' ? 1 : -1);
    const newContent = SLIDE_DATA[newIdx - 1];
    const activeSlide = sliderRef.current.querySelector('.karya-slide-container.active');
    const imgElement = activeSlide?.querySelector('.karya-slide-img img');
    if (!imgElement || imgElement.src === newContent.img) {
      isAnimating = false;
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        activeIdx = newIdx;
        isAnimating = false;
        updatePreview(newContent);
        animateTitleToCaption(newContent.name);
      }
    });
    tl.to(imgElement, { opacity: 0, duration: 0.2 })
      .call(() => {
        imgElement.src = newContent.img;
        const catElem = activeSlide.querySelector('.karya-card-category');
        if (catElem && newContent.category) catElem.innerText = newContent.category;
        const tagsElem = activeSlide.querySelector('.karya-card-tags');
        if (tagsElem && newContent.tags) {
          tagsElem.innerHTML = newContent.tags.map(t => `<span class="karya-card-tag">${t}</span>`).join('');
        }
      })
      .to(imgElement, { opacity: 1, duration: 0.3 });
  };

  const transition = (direction) => {
    if (isAnimating) return;
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) transitionMobile(direction);
    else transitionDesktop(direction);
  };

  const startAutoSlide = () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isAnimating) transition('next');
    }, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  const redirectActiveSlide = () => {
    if (isAnimating) return;
    const currentData = SLIDE_DATA[activeIdx - 1];
    if (currentData?.link && currentData.link !== '#') {
      window.open(currentData.link, '_blank');
    }
    resetAutoSlide();
  };

  const initSlides = () => {
    const old = sliderRef.current.querySelectorAll('.karya-slide-container');
    old.forEach(s => s.remove());

    const isMobile = window.innerWidth <= 1024;
    if (!isMobile) {
      const prevIdx = getIndex(-1);
      const nextIdx = getIndex(1);
      const prevSlide = createSlide(SLIDE_DATA[prevIdx - 1], 'prev');
      const activeSlide = createSlide(SLIDE_DATA[activeIdx - 1], 'active');
      const nextSlide = createSlide(SLIDE_DATA[nextIdx - 1], 'next');
      sliderRef.current.append(prevSlide, activeSlide, nextSlide);
      gsap.set('.karya-slide-container.prev', { left: '10%', width: '46%', height: '56%', scale: 0.52, rotateY: 0, z: 0, opacity: 0.85, zIndex: 10, clipPath: 'none' });
      gsap.set('.karya-slide-container.active', { left: '50%', width: '46%', height: '56%', scale: 1, rotateY: 0, z: 0, opacity: 1, zIndex: 20, clipPath: 'none' });
      gsap.set('.karya-slide-container.next', { left: '90%', width: '46%', height: '56%', scale: 0.52, rotateY: 0, z: 0, opacity: 0.85, zIndex: 10, clipPath: 'none' });
    } else {
      const activeSlide = createSlide(SLIDE_DATA[activeIdx - 1], 'active');
      sliderRef.current.appendChild(activeSlide);
      gsap.set('.karya-slide-container.active', { left: '50%', scale: 1, clipPath: 'none' });
    }

    if (titleDivRef.current) {
      const h1 = titleDivRef.current.querySelector('h1');
      if (h1) h1.innerText = "";
      titleDivRef.current.classList.remove('karya-title-visible');
    }
    if (captionDivRef.current) {
      captionDivRef.current.innerText = "";
      captionDivRef.current.classList.remove('karya-show');
    }
    setTimeout(() => animateTitleToCaption(SLIDE_DATA[0].name), 500);
    updatePreview(SLIDE_DATA[0]);
  };

  useEffect(() => {
    initSlides();
    startAutoSlide();

    const handleClickSlide = (e) => {
      // Detail button - opens modal
      const detailBtn = e.target.closest('.karya-card-detail-btn');
      if (detailBtn) {
        e.stopPropagation();
        const name = detailBtn.dataset.project;
        const project = SLIDE_DATA.find(p => p.name === name);
        if (project) openModal(project);
        return;
      }
      // Visit link - let anchor handle naturally
      if (e.target.closest('.karya-card-link-badge')) return;

      const slide = e.target.closest('.karya-slide-container');
      if (!slide || isAnimating) return;
      if (slide.classList.contains('next')) transition('next');
      else if (slide.classList.contains('prev')) transition('prev');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    const handlePrevArrow = () => transition('prev');
    const handleNextArrow = () => transition('next');
    let wasMobile = window.innerWidth <= 1024;
    const handleResize = () => {
      const nowMobile = window.innerWidth <= 1024;
      if (wasMobile !== nowMobile) window.location.reload();
      wasMobile = nowMobile;
    };

    const sliderNode = sliderRef.current;
    const prevArrowNode = prevArrowRef.current;
    const nextArrowNode = nextArrowRef.current;

    sliderNode?.addEventListener('click', handleClickSlide);
    prevArrowNode?.addEventListener('click', handlePrevArrow);
    nextArrowNode?.addEventListener('click', handleNextArrow);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(autoSlideInterval);
      clearTitleTimer();
      sliderNode?.removeEventListener('click', handleClickSlide);
      prevArrowNode?.removeEventListener('click', handlePrevArrow);
      nextArrowNode?.removeEventListener('click', handleNextArrow);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [getIndex, openModal, closeModal]);

  return (
    <>
      <style>{`
        .karya-slider {
          position: relative;
          width: 100%;
          max-width: 100%;
          min-height: 680px;
          height: 100svh;
          overflow: hidden;
          background: #f7f4ee;
          font-family: 'Manrope', sans-serif;
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba(29, 37, 44, 0.12);
        }

        .karya-header-badge {
          position: absolute;
          top: clamp(2rem, 7vh, 4.5rem);
          left: clamp(1.5rem, 6vw, 6rem);
          transform: none;
          z-index: 25;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.2rem 0 0.2rem 0.85rem;
          border-left: 2px solid #dc2626;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7b3027;
          pointer-events: none;
        }
        .karya-header-badge span.sparkle {
          color: #dc2626;
          animation: karyaPulse 2s infinite alternate ease-in-out;
        }
        .karya-section-heading {
          position: absolute;
          top: clamp(4rem, 9vh, 6rem);
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          pointer-events: none;
          text-align: center;
          white-space: nowrap;
        }
        .karya-section-heading span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
          color: rgba(220, 38, 38, 0.85);
          font-size: 0.68rem;
          font-weight: 700;
          font-family: monospace;
          letter-spacing: 0.35em;
          text-transform: uppercase;
        }
        .karya-section-heading span::before,
        .karya-section-heading span::after {
          content: '';
          width: 2.5rem;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(220, 38, 38, 0.6));
        }
        .karya-section-heading span::after {
          background: linear-gradient(to left, transparent, rgba(220, 38, 38, 0.6));
        }
        .karya-section-heading h2 {
          margin: 0;
          color: #1d252c;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        @keyframes karyaPulse {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }

        /* EFEK GLOSSY UTAMA KARTU */
        .karya-slide-container {
          position: absolute;
          width: 46%;
          height: 56%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #dedbd5;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 
            0 24px 48px -18px rgba(46, 39, 31, 0.35),
            0 0 24px rgba(220, 38, 38, 0.06),
            inset 0 1px 2px rgba(255, 255, 255, 0.3);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease;
        }

        /* KILAPAN SHINE GLOSSY SEPERTI KACA SAAT HOVER */
        .karya-slide-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -130%;
          width: 75%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.22),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 15;
          pointer-events: none;
        }
        .karya-slide-container:hover::before {
          left: 160%;
        }
        .karya-slide-container:hover {
          border-color: rgba(220, 38, 38, 0.7);
          box-shadow: 
            0 40px 80px -15px rgba(0, 0, 0, 0.98),
            0 0 50px rgba(220, 38, 38, 0.4),
            inset 0 0 0 1px rgba(220, 38, 38, 0.25),
            inset 0 1px 2px rgba(255, 255, 255, 0.4);
        }

        .karya-slide-img {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #0c0c12;
        }
        .karya-slide-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
          filter: brightness(0.9) contrast(1.03);
        }
        .karya-slide-container:hover .karya-slide-img img {
          transform: scale(1.08);
          filter: brightness(1.0) contrast(1.06);
        }

        .karya-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(5, 7, 10, 0.12) 0%, rgba(5, 7, 10, 0) 42%, rgba(5, 7, 10, 0.8) 100%);
          pointer-events: none;
        }

        .karya-card-top-info {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          z-index: 10;
        }
        .karya-card-category {
          display: inline-block;
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: #fee2e2;
        }

        .karya-card-bottom-info {
          position: absolute;
          bottom: 1.25rem;
          left: 1.35rem;
          right: 1.35rem;
          z-index: 10;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: flex-end;
          gap: 0.6rem;
        }
        .karya-card-description {
          grid-column: 1 / -1;
          margin: 0 0 0.35rem;
          max-width: 46rem;
          color: rgba(255, 255, 255, 0.88);
          font-size: clamp(0.72rem, 1vw, 0.92rem);
          line-height: 1.45;
          text-wrap: balance;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .karya-slide-container.prev .karya-card-description,
        .karya-slide-container.next .karya-card-description {
          display: none;
        }
        .karya-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .karya-card-tag {
          font-size: 0.65rem;
          font-weight: 500;
          padding: 0.2rem 0.55rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          color: #d1d5db;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* ACTIONS ROW */
        .karya-card-actions {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .karya-slide-container.prev .karya-card-actions,
        .karya-slide-container.next .karya-card-actions {
          display: none;
        }

        /* DETAIL BUTTON */
        .karya-card-detail-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
          font-family: 'Manrope', sans-serif;
        }
        .karya-card-detail-btn:hover {
          background: rgba(255, 255, 255, 0.28);
          transform: translateY(-2px);
        }

        /* VISIT BADGE */
        .karya-card-link-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.8rem;
          border-radius: 7px;
          background: #c83d32;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 6px 14px rgba(126, 44, 35, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          white-space: nowrap;
          text-decoration: none;
          transition: transform 0.25s ease, background-color 0.25s ease;
        }
        .karya-card-link-badge:hover {
          background: rgba(185, 28, 28, 1);
          transform: translateY(-2px);
        }

        .karya-slide-container.prev {
          left: 10%;
          transform: translate(-50%, -50%) scale(0.52);
          opacity: 1;
          filter: brightness(0.8);
          z-index: 10;
          clip-path: none;
          box-shadow: 
            0 20px 38px rgba(46, 39, 31, 0.25),
            0 0 24px rgba(220, 38, 38, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }
        .karya-slide-container.active {
          left: 50%;
          width: 46%;
          height: 56%;
          top: 56%;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          filter: brightness(1);
          z-index: 20;
          clip-path: none;
        }
        .karya-slide-container.next {
          left: 90%;
          transform: translate(-50%, -50%) scale(0.52);
          opacity: 1;
          filter: brightness(0.8);
          z-index: 10;
          clip-path: none;
          box-shadow: 
            0 20px 38px rgba(46, 39, 31, 0.25),
            0 0 24px rgba(220, 38, 38, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }
        .karya-slide-container.prev:hover {
          filter: brightness(1);
          border-color: rgba(220, 38, 38, 0.8);
          transform: translate(-50%, -50%) scale(0.62);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.95),
            0 0 45px rgba(220, 38, 38, 0.45),
            inset 0 0 0 1px rgba(220, 38, 38, 0.3);
        }
        .karya-slide-container.next:hover {
          filter: brightness(1);
          border-color: rgba(220, 38, 38, 0.8);
          transform: translate(-50%, -50%) scale(0.62);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.95),
            0 0 45px rgba(220, 38, 38, 0.45),
            inset 0 0 0 1px rgba(220, 38, 38, 0.3);
        }

        .karya-slider-title {
          position: absolute;
          top: 17%;
          left: clamp(1.5rem, 6vw, 6rem);
          transform: none;
          width: min(38%, 520px);
          max-width: 1200px;
          text-align: left;
          z-index: 30;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
        }
        .karya-slider-title.karya-title-visible {
          opacity: 1;
          visibility: visible;
        }
        .karya-slider-title h1 {
          font-size: clamp(2rem, 4.5vw, 4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #3d342a 0%, #7b3027 72%, #c83d32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          line-height: 1.15;
          margin: 0;
        }

        .karya-slider-preview {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          display: none;
          overflow: hidden;
          filter: blur(12px) brightness(1) saturate(0.75);
          pointer-events: none;
        }
        .karya-slider-preview img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: karyaSlowScale 30s infinite alternate ease-in-out;
        }
        @keyframes karyaSlowScale {
          0% { transform: scale(1) translateX(0%); }
          100% { transform: scale(1.18) translateX(1.5%); }
        }

        .karya-ambient-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          display: none;
          pointer-events: none;
          z-index: 1;
        }

        .karya-slide-caption {
          position: absolute;
          bottom: 2.5rem;
          left: 2.5rem;
          z-index: 35;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.45rem 1.3rem;
          border-radius: 7px;
          border: 1px solid rgba(61, 52, 42, 0.14);
          box-shadow: 0 10px 28px rgba(83, 64, 40, 0.12);
          pointer-events: none;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .karya-slide-caption.karya-show {
          opacity: 1;
          transform: translateY(0);
        }
        .karya-cat-badge {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #dc2626;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
          background: rgba(220, 38, 38, 0.15);
          border: 1px solid rgba(220, 38, 38, 0.35);
        }
        .karya-slide-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.02em;
        }
        .karya-caption-arrow {
          display: flex;
          align-items: center;
          color: #ffb07c;
        }

        .karya-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3d342a;
          cursor: pointer;
          z-index: 40;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(61, 52, 42, 0.16);
          box-shadow: 0 8px 20px rgba(83, 64, 40, 0.12);
          padding: 0;
          appearance: none;
          -webkit-tap-highlight-color: transparent;
        }
        .karya-nav-arrow:focus-visible {
          outline: 3px solid #ffb07c;
          outline-offset: 4px;
        }
        .karya-nav-arrow:hover {
          background: #c83d32;
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 20px rgba(126, 44, 35, 0.2);
        }
        .karya-prev-arrow { left: clamp(1rem, 3vw, 3rem); }
        .karya-next-arrow { right: clamp(1rem, 3vw, 3rem); }

        .karya-footer {
          position: absolute;
          right: 2.5rem;
          bottom: 2.2rem;
          z-index: 35;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(61, 52, 42, 0.62);
          pointer-events: none;
          letter-spacing: 0.03em;
        }
        .karya-footer span.icon {
          color: #dc2626;
        }

        /* MEDIA QUERY UNTUK MOBILE & TABLET (LEBAR ≤ 1024px) */
        @media (max-width: 1024px) {
          .karya-slider {
            min-height: 620px;
            height: 100svh;
          }
          .karya-header-badge {
            top: 1.5rem;
            left: 1rem;
            font-size: 0.65rem;
            padding: 0.2rem 0 0.2rem 0.65rem;
          }
          .karya-slide-container {
            width: min(84%, 430px);
            height: min(62%, 540px);
            border-radius: 18px;
          }
          .karya-slide-container.prev,
          .karya-slide-container.next {
            display: none;
          }
          .karya-slide-container.active {
            left: 50%;
            width: min(90%, 640px);
            height: min(52%, 390px);
            top: 58%;
            transform: translate(-50%, -50%) scale(1);
            display: block;
          }
          .karya-slider-title h1 {
            font-size: clamp(1.8rem, 7vw, 3rem);
          }
          .karya-slider-title {
            top: 14%;
            left: 1rem;
            width: calc(100% - 2rem);
          }
          .karya-section-heading {
            top: 4.5rem;
          }
          .karya-nav-arrow {
            width: 46px;
            height: 46px;
            border-radius: 10px;
          }
          .karya-prev-arrow { left: 1rem; }
          .karya-next-arrow { right: 1rem; }
          .karya-slider-preview {
            display: none;
          }
          .karya-slide-caption {
            bottom: 1.5rem;
            left: 1rem;
            font-size: 0.75rem;
            padding: 0.35rem 0.9rem;
            max-width: 60%;
          }
          .karya-card-description {
            font-size: 0.78rem;
          }
          .karya-footer {
            right: 1rem;
            bottom: 1.5rem;
            font-size: 0.65rem;
            display: none;
          }
        }
      `}</style>

      <div
        ref={sliderRef}
        id="project"
        className="karya-slider"
        style={{ position: 'relative', zIndex: 20, isolation: 'isolate' }}
      >
        <div className="karya-section-heading">
          <span>WHAT I'VE BUILT</span>
          <h2>Project</h2>
        </div>

        <div ref={previewDivRef} className="karya-slider-preview"></div>
        <div className="karya-ambient-glow"></div>
        <div ref={captionDivRef} className="karya-slide-caption"></div>

        <button type="button" ref={prevArrowRef} className="karya-nav-arrow karya-prev-arrow" aria-label="Previous Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <button type="button" ref={nextArrowRef} className="karya-nav-arrow karya-next-arrow" aria-label="Next Slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* ===== PROJECT DETAIL MODAL ===== */}
      {modalProject && (
        <div
          className="karya-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          role="dialog"
          aria-modal="true"
          aria-label={`Detail project ${modalProject.name}`}
        >
          <div ref={modalRef} className="karya-modal">
            {/* Close button */}
            <button
              type="button"
              className="karya-modal-close"
              onClick={closeModal}
              aria-label="Tutup modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* LEFT: Gallery panel */}
            <div className="karya-modal-gallery">
              <div className="karya-modal-img-wrap">
                <img
                  src={modalProject.detail.images[galleryIdx] ?? modalProject.img}
                  alt={`${modalProject.name} - gambar ${galleryIdx + 1}`}
                  className="karya-modal-img"
                />
                <div className="karya-modal-img-overlay" />
                <span className="karya-modal-category-badge">{modalProject.category}</span>
              </div>
              {/* Gallery dots */}
              {modalProject.detail.images.length > 1 && (
                <div className="karya-modal-dots">
                  {modalProject.detail.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`karya-modal-dot${i === galleryIdx ? ' active' : ''}`}
                      onClick={() => setGalleryIdx(i)}
                      aria-label={`Gambar ${i + 1}`}
                    />
                  ))}
                </div>
              )}
              {/* Gallery arrows */}
              {modalProject.detail.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="karya-modal-gallery-arrow karya-modal-gallery-prev"
                    onClick={() => setGalleryIdx(i => (i - 1 + modalProject.detail.images.length) % modalProject.detail.images.length)}
                    aria-label="Gambar sebelumnya"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    type="button"
                    className="karya-modal-gallery-arrow karya-modal-gallery-next"
                    onClick={() => setGalleryIdx(i => (i + 1) % modalProject.detail.images.length)}
                    aria-label="Gambar berikutnya"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            {/* RIGHT: Info panel */}
            <div className="karya-modal-info">
              <div className="karya-modal-info-top">
                <div className="karya-modal-tags-row">
                  {modalProject.tags.map(t => (
                    <span key={t} className="karya-modal-tag">{t}</span>
                  ))}
                </div>
                <h2 className="karya-modal-title">{modalProject.name}</h2>
                <p className="karya-modal-desc">{modalProject.detail.fullDescription}</p>
              </div>

              <div className="karya-modal-highlights">
                <h3 className="karya-modal-highlights-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Fitur Unggulan
                </h3>
                <ul className="karya-modal-highlights-list">
                  {modalProject.detail.highlights.map((h, i) => (
                    <li key={i} className="karya-modal-highlight-item">
                      <span className="karya-modal-highlight-dot" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="karya-modal-footer">
                <a
                  href={modalProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="karya-modal-visit-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Kunjungi Website
                </a>
                <button type="button" className="karya-modal-close-btn" onClick={closeModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>

          <style>{`
            .karya-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 9999;
              background: rgba(0, 0, 0, 0.80);
              backdrop-filter: blur(6px);
              -webkit-backdrop-filter: blur(6px);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1rem;
              animation: karya-modal-fadein 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes karya-modal-fadein {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            .karya-modal {
              position: relative;
              display: flex;
              flex-direction: row;
              width: 100%;
              max-width: 960px;
              max-height: 90vh;
              background: #0d0d12;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid rgba(255,255,255,0.1);
              box-shadow: 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px rgba(220,38,38,0.12);
              animation: karya-modal-slidein 0.32s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes karya-modal-slidein {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .karya-modal-close {
              position: absolute;
              top: 1rem;
              right: 1rem;
              z-index: 20;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.15);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.2s, transform 0.2s;
              font-family: 'Manrope', sans-serif;
            }
            .karya-modal-close:hover {
              background: rgba(220,38,38,0.7);
              transform: scale(1.1);
            }
            /* GALLERY PANEL */
            .karya-modal-gallery {
              flex: 0 0 45%;
              position: relative;
              background: #080810;
              overflow: hidden;
            }
            .karya-modal-img-wrap {
              width: 100%;
              height: 100%;
              position: relative;
            }
            .karya-modal-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transition: opacity 0.3s ease;
            }
            .karya-modal-img-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%);
              pointer-events: none;
            }
            .karya-modal-category-badge {
              position: absolute;
              top: 1.1rem;
              left: 1.1rem;
              padding: 0.3rem 0.85rem;
              border-radius: 20px;
              background: rgba(0,0,0,0.55);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.18);
              font-size: 0.68rem;
              font-weight: 600;
              letter-spacing: 0.06em;
              color: #fee2e2;
              font-family: 'Manrope', sans-serif;
            }
            .karya-modal-dots {
              position: absolute;
              bottom: 1rem;
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              gap: 0.45rem;
            }
            .karya-modal-dot {
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background: rgba(255,255,255,0.35);
              border: none;
              cursor: pointer;
              transition: background 0.2s, transform 0.2s;
              padding: 0;
            }
            .karya-modal-dot.active {
              background: #f87171;
              transform: scale(1.3);
            }
            .karya-modal-gallery-arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: rgba(255,255,255,0.12);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255,255,255,0.2);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.2s;
            }
            .karya-modal-gallery-arrow:hover { background: rgba(220,38,38,0.6); }
            .karya-modal-gallery-prev { left: 0.75rem; }
            .karya-modal-gallery-next { right: 0.75rem; }
            /* INFO PANEL */
            .karya-modal-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 2.2rem 2rem 1.8rem;
              overflow-y: auto;
              scrollbar-width: thin;
              scrollbar-color: rgba(220,38,38,0.35) transparent;
              font-family: 'Manrope', sans-serif;
            }
            .karya-modal-info-top { margin-bottom: 1.5rem; }
            .karya-modal-tags-row {
              display: flex;
              flex-wrap: wrap;
              gap: 0.4rem;
              margin-bottom: 0.9rem;
            }
            .karya-modal-tag {
              font-size: 0.65rem;
              font-weight: 600;
              letter-spacing: 0.06em;
              padding: 0.22rem 0.7rem;
              border-radius: 20px;
              border: 1px solid rgba(220,38,38,0.4);
              background: rgba(220,38,38,0.12);
              color: #fca5a5;
            }
            .karya-modal-title {
              margin: 0 0 0.8rem;
              font-size: clamp(1.5rem, 3vw, 2.1rem);
              font-weight: 800;
              letter-spacing: -0.02em;
              line-height: 1.15;
              color: #ffffff;
            }
            .karya-modal-desc {
              margin: 0;
              font-size: 0.9rem;
              line-height: 1.65;
              color: rgba(255,255,255,0.65);
            }
            /* HIGHLIGHTS */
            .karya-modal-highlights {
              background: rgba(255,255,255,0.04);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 12px;
              padding: 1.1rem 1.2rem;
              margin-bottom: 1.5rem;
            }
            .karya-modal-highlights-title {
              margin: 0 0 0.75rem;
              font-size: 0.75rem;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: #f87171;
              display: flex;
              align-items: center;
              gap: 0.45rem;
            }
            .karya-modal-highlights-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              gap: 0.55rem;
            }
            .karya-modal-highlight-item {
              font-size: 0.85rem;
              color: rgba(255,255,255,0.75);
              line-height: 1.45;
              display: flex;
              align-items: flex-start;
              gap: 0.6rem;
            }
            .karya-modal-highlight-dot {
              flex-shrink: 0;
              margin-top: 0.45rem;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #ef4444;
            }
            /* FOOTER */
            .karya-modal-footer {
              display: flex;
              gap: 0.75rem;
              align-items: center;
              flex-wrap: wrap;
            }
            .karya-modal-visit-btn {
              display: inline-flex;
              align-items: center;
              gap: 0.55rem;
              padding: 0.65rem 1.3rem;
              border-radius: 10px;
              background: linear-gradient(135deg, #dc2626, #b91c1c);
              color: #fff;
              font-size: 0.85rem;
              font-weight: 700;
              text-decoration: none;
              border: none;
              cursor: pointer;
              box-shadow: 0 8px 20px rgba(220,38,38,0.35);
              transition: transform 0.2s, box-shadow 0.2s;
              font-family: 'Manrope', sans-serif;
            }
            .karya-modal-visit-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 28px rgba(220,38,38,0.5);
            }
            .karya-modal-close-btn {
              padding: 0.65rem 1.2rem;
              border-radius: 10px;
              background: rgba(255,255,255,0.07);
              border: 1px solid rgba(255,255,255,0.15);
              color: rgba(255,255,255,0.65);
              font-size: 0.85rem;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s, color 0.2s;
              font-family: 'Manrope', sans-serif;
            }
            .karya-modal-close-btn:hover {
              background: rgba(255,255,255,0.12);
              color: #fff;
            }
            /* RESPONSIVE */
            @media (max-width: 640px) {
              .karya-modal {
                flex-direction: column;
                max-height: 95vh;
              }
              .karya-modal-gallery {
                flex: 0 0 240px;
                min-height: 240px;
              }
              .karya-modal-info {
                padding: 1.4rem 1.2rem 1.2rem;
              }
              .karya-modal-title {
                font-size: 1.4rem;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}