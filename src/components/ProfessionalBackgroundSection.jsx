import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

gsap.registerPlugin(ScrollTrigger);

// ============ HELPER GOOGLE DRIVE ============
const getGoogleDriveFileId = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
};

const getGoogleDriveThumbnail = (url) => {
    const fileId = getGoogleDriveFileId(url);
    if (fileId) {
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return `https://images.weserv.nl/?url=${encodeURIComponent(directUrl)}&w=800&h=600&fit=cover`;
    }
    return url;
};

// ============ DATA ============
export const rawExperiences = [
    // ── Lisensi & Sertifikasi Resmi ──
    {
        id: 0,
        title: 'Sertifikat HKI',
        role: 'Hak Atas Kekayaan Intelektual',
        issuer: 'Kementerian Hukum & HAM RI',
        category: 'Lisensi & HKI',
        icon: 'fa-shield-halved',
        tags: ['Hak Cipta', 'Inovasi Digital', 'SILADATA'],
        description: 'Pengakuan resmi Hak Cipta atas inovasi software SILADATA (Sistem Layanan Dokumen Akreditasi) terdaftar di Kemenkumham RI.',
        year: '2026',
        certificate: 'https://drive.google.com/file/d/1ZHm_D_ajLQtBQiuUYI6U84aOnoYEoJ4L/view?usp=drive_link',
    },
    {
        id: 2,
        title: 'Sertifikat BNSP',
        role: 'Badan Nasional Sertifikasi Profesi',
        issuer: 'BNSP Republik Indonesia',
        category: 'Sertifikasi Profesi',
        icon: 'fa-award',
        tags: ['Kompetensi Nasional', 'Teknologi Informasi'],
        description: 'Sertifikasi kompetensi profesional nasional bidang Teknologi Informasi dengan standar industri yang teruji.',
        year: '2025',
        certificate: 'https://drive.google.com/file/d/1rsrf3LQ5EeqACZ4O7PvpAdpmTk8snZ5J/view?pli=1',
        image: '/img/sertif.webp',
    },
    {
        id: 4,
        title: 'Sertifikat UKK',
        role: 'Uji Kompetensi Keahlian RPL',
        issuer: 'Kemendikbud & Industri RPL',
        category: 'Uji Kompetensi',
        icon: 'fa-code',
        tags: ['Rekayasa Perangkat Lunak', 'Pemrograman Web'],
        description: 'Uji kompetensi teknis Rekayasa Perangkat Lunak dalam pengembangan aplikasi web & analisis sistem.',
        year: '2024',
        certificate: 'https://drive.google.com/file/d/1XY4nEWlOES9m9tWEgYsDiRC1YbGAQbeO/view',
    },
];

// ============ MAPPING GAMBAR ============
const PLACEHOLDER_IMAGE = '/img/cert_placeholder.webp';

const experiences = rawExperiences.map((exp) => {
    if (exp.image && !exp.image.includes('drive.google.com')) {
        return { ...exp, image: exp.image };
    }
    const driveLink = exp.certificate || exp.image;
    if (driveLink) {
        return {
            ...exp,
            image: getGoogleDriveThumbnail(driveLink),
        };
    }
    return { ...exp, image: PLACEHOLDER_IMAGE };
});

// ============ KOMPONEN UTAMA ============
export default function RelatedExperience() {
    const [selectedExperience, setSelectedExperience] = useState(experiences[0]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [modalViewMode, setModalViewMode] = useState('pdf'); // 'pdf' | 'image'
    const [iframeLoading, setIframeLoading] = useState(true);

    const headerRef = useRef(null);
    const modalRef = useRef(null);
    const sliderContainerRef = useRef(null);

    const currentExp = selectedExperience || experiences[0];
    const driveFileId = getGoogleDriveFileId(currentExp.certificate);

    // Reset loading state for iframe when modal opens or view changes
    useEffect(() => {
        if (lightboxOpen) {
            setIframeLoading(true);
        }
    }, [lightboxOpen, selectedExperience, modalViewMode]);

    // Preload images
    useEffect(() => {
        experiences.forEach((exp) => {
            const img = new Image();
            img.src = exp.image;
            img.onerror = () => {
                img.src = PLACEHOLDER_IMAGE;
            };
        });
    }, []);

    // Header GSAP Reveal Animation (ringan agar section tidak terlalu berat)
    useEffect(() => {
        const headerEl = headerRef.current;
        const sliderEl = sliderContainerRef.current;
        if (!headerEl || !sliderEl) return;

        const ctx = gsap.context(() => {
            const targets = headerEl.querySelectorAll('.sertif-header-reveal');
            if (targets.length) {
                gsap.fromTo(
                    targets,
                    { opacity: 0, y: 18 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: headerEl,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }

            gsap.fromTo(
                sliderEl,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sliderEl,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    // Prevent main page scrolling when modal preview is open & ESC to close
    useEffect(() => {
        if (!lightboxOpen) return;

        // Lock document & body overflow
        const originalBodyOverflow = document.body.style.overflow;
        const originalDocOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
                e.stopPropagation();
                setLightboxOpen(false);
            }
        };

        const handleMouseMove = () => {
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                window.focus();
                if (modalRef.current) {
                    modalRef.current.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyDown, true);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Auto focus window and modal
        const focusTimer = setTimeout(() => {
            window.focus();
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }, 50);

        // Hide navbar while lightbox modal is active
        document.body.classList.add('lightbox-modal-open');

        return () => {
            clearTimeout(focusTimer);
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalDocOverflow;
            document.body.classList.remove('lightbox-modal-open');

            window.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('keyup', handleKeyDown, true);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [lightboxOpen]);

    const handleOpenModal = (exp, mode = 'pdf') => {
        setSelectedExperience(exp);
        setModalViewMode(mode);
        setLightboxOpen(true);
    };

    return (
        <div
            id="certificates"
            className="relative md:min-h-screen font-sans selection:bg-red-400/30 pt-6 sm:pt-8 pb-10 sm:pb-16 flex flex-col justify-start overflow-hidden"
        >
            <SectionBackdrop variant="cool" />

            <style>{`
                .certificate-header-panel {
                    width: min(100%, 1120px);
                    margin: 0 auto 1.5rem;
                    padding: 1.25rem 1rem;
                    border-radius: 28px;
                    background: rgba(255, 255, 255, 0.34);
                    border: 1px solid rgba(255, 255, 255, 0.42);
                    box-shadow: 0 10px 24px rgba(24, 24, 27, 0.04);
                    backdrop-filter: blur(10px);
                }
                .certificate-top-copy {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.9rem;
                    text-align: center;
                }
                .certificate-top-text {
                    margin: 0;
                    font-size: clamp(1rem, 2vw, 1.9rem);
                    line-height: 1.4;
                    color: rgba(24, 24, 27, 0.92);
                    letter-spacing: -0.04em;
                    font-weight: 500;
                }
                .certificate-tag-row {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.6rem;
                }
                .certificate-tag {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.55rem 1rem;
                    border-radius: 999px;
                    border: 1px solid rgba(120, 113, 108, 0.18);
                    background: rgba(255, 255, 255, 0.28);
                    color: rgba(39, 39, 42, 0.78);
                    font-size: 0.78rem;
                    font-weight: 500;
                    letter-spacing: -0.02em;
                }
                .certificate-title-wrap {
                    position: relative;
                    margin: 0 auto 2.5rem;
                    text-align: center;
                    padding: 1rem 1rem 0;
                }
                .certificate-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                    font-size: 0.65rem;
                    font-family: monospace;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    color: rgba(239, 68, 68, 0.85);
                }
                .certificate-label::before,
                .certificate-label::after {
                    content: "";
                    width: 2.5rem;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(220, 38, 38, 0.6));
                }
                .certificate-label::after {
                    background: linear-gradient(to left, transparent, rgba(220, 38, 38, 0.6));
                }
                .certificate-title {
                    display: inline-block;
                    margin: 0;
                    font-size: clamp(2rem, 5vw, 3.25rem);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    font-weight: 800;
                    color: #1d252c;
                }
                .certificate-title span {
                    background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                .certificate-subtitle {
                    display: none;
                }
                .swiper {
                    padding-bottom: 2rem !important;
                    padding-top: 1rem !important;
                    overflow: hidden !important;
                }
                .swiper-wrapper {
                    align-items: stretch;
                }
                .swiper-slide {
                    width: 100%;
                    height: auto;
                }
                .cert-card {
                    min-height: 380px;
                    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
                    will-change: transform;
                }
                .swiper-slide-active .cert-card {
                    border-color: rgba(248, 113, 113, 0.55);
                    box-shadow: 0 18px 35px -24px rgba(248, 113, 113, 0.45);
                    transform: translateY(-2px);
                }
                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.25);
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background: #f87171;
                    box-shadow: 0 0 10px rgba(248, 113, 113, 0.7);
                }
                .swiper-button-next, .swiper-button-prev {
                    color: #ffffff !important;
                    background: rgba(15, 15, 15, 0.9);
                    width: 48px;
                    height: 48px;
                    border-radius: 999px;
                    border: 2px solid rgba(255,255,255,0.3);
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 20px !important;
                    font-weight: 700;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    color: #fff !important;
                    background: rgba(220, 38, 38, 0.95);
                    border-color: rgba(255,255,255,0.6);
                    transform: scale(1.08);
                    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
                }
                @media (min-width: 640px) {
                    .swiper-slide {
                        width: 340px;
                    }
                    .cert-card {
                        min-height: 430px;
                    }
                }
                @media (min-width: 1024px) {
                    .swiper-slide {
                        width: 360px;
                    }
                }
            `}</style>

            <div className="relative z-10 w-full flex flex-col justify-start md:justify-center">

                {/* Section Header */}
                <div ref={headerRef} className="relative mx-auto mb-8 sm:mb-12 selection:bg-red-500/30 px-4 sm:px-6">
                    <div className="certificate-title-wrap">
                        <div className="sertif-header-reveal certificate-label">MY ACHIEVEMENTS</div>
                        <h2 className="sertif-header-reveal certificate-title">
                            Certificate <span>Collection</span>
                        </h2>
                    </div>
                </div>

                {/* 3D Carousel Swiper */}
                <div ref={sliderContainerRef} className="w-full px-0 sm:px-4 lg:px-8 pb-4 sm:pb-12">
                    <Swiper
                        grabCursor={true}
                        centeredSlides={true}
                        centeredSlidesBounds={true}
                        centerInsufficientSlides={true}
                        slidesPerView={'auto'}
                        initialSlide={0}
                        loop={experiences.length > 3}
                        spaceBetween={18}
                        speed={500}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        breakpoints={{
                            320: {
                                slidesPerView: 1.05,
                                spaceBetween: 14,
                            },
                            640: {
                                slidesPerView: 1.4,
                                spaceBetween: 18,
                            },
                            1024: {
                                slidesPerView: 2.2,
                                spaceBetween: 20,
                            },
                        }}
                        modules={[Pagination, Navigation]}
                        className="w-full max-w-7xl mx-auto"
                    >
                        {experiences.map((exp, idx) => {
                            const fileId = getGoogleDriveFileId(exp.certificate);

                            return (
                                <SwiperSlide key={exp.id} className="flex h-auto">
                                    <div className="cert-card bg-neutral-950/90 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 flex flex-col w-full h-full">

                                        {/* Thumbnail Container */}
                                        <div
                                            className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-neutral-900 border-b border-white/10 group"
                                            onClick={() => handleOpenModal(exp, fileId ? 'pdf' : 'image')}
                                        >
                                            <img
                                                src={exp.image}
                                                alt={exp.title}
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    if (e.target.src !== PLACEHOLDER_IMAGE && !e.target.src.endsWith(PLACEHOLDER_IMAGE)) {
                                                        e.target.src = PLACEHOLDER_IMAGE;
                                                    }
                                                }}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-80" />

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-lg backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                    <i className={`fas ${fileId ? 'fa-file-pdf' : 'fa-expand'} text-lg`} />
                                                </div>
                                            </div>

                                            {/* Badge Tahun */}
                                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-red-400/30 text-[10px] font-mono font-bold text-red-300 shadow-sm flex items-center gap-1.5 z-10">
                                                <i className="far fa-calendar-alt text-red-400/80" />
                                                {exp.year}
                                            </div>

                                            {/* Kategori Badge */}
                                            <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono font-medium text-neutral-300 shadow-sm flex items-center gap-1.5 z-10">
                                                <i className={`fas ${exp.icon || 'fa-certificate'} text-[10px] text-neutral-400`} />
                                                {exp.category || 'Sertifikat'}
                                            </div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1.5">
                                                        <i className="fas fa-award text-[10px]" />
                                                        {exp.role}
                                                    </p>
                                                </div>

                                                <p className="text-[13px] text-neutral-400 leading-relaxed line-clamp-3">
                                                    {exp.description}
                                                </p>
                                            </div>

                                            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent my-4" />

                                            <div className="flex items-center gap-2.5 mt-auto">
                                                <button
                                                    onClick={() => handleOpenModal(exp, fileId ? 'pdf' : 'image')}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 text-[13px] font-bold transition-all duration-300"
                                                >
                                                    <i className="fas fa-eye text-xs" />
                                                    <span>Lihat Preview</span>
                                                </button>

                                                {exp.certificate && (
                                                    <a
                                                        href={exp.certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-300"
                                                        title="Buka Drive Tab Baru"
                                                    >
                                                        <i className="fas fa-external-link-alt text-[13px]" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>

            {/* FULL DOCUMENT MODAL LIGHTBOX (PDF EMBED / IMAGE SCROLL) */}
            {lightboxOpen && (
                <>
                    <style>{`
                        body.lightbox-modal-open .navbar-shell {
                            opacity: 0 !important;
                            pointer-events: none !important;
                            transform: translateY(-120%) !important;
                            transition: opacity 0.3s ease, transform 0.3s ease !important;
                        }
                    `}</style>
                    <div
                        ref={modalRef}
                        tabIndex={-1}
                        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn outline-none"
                        onPointerDown={(e) => {
                            if (e.target === modalRef.current) {
                                setLightboxOpen(false);
                            }
                        }}
                        onMouseDown={(e) => {
                            if (e.target === modalRef.current) {
                                setLightboxOpen(false);
                            }
                        }}
                        onClick={(e) => {
                            if (e.target === modalRef.current) {
                                setLightboxOpen(false);
                            }
                        }}
                    >
                        <div
                            className="modal-scrollable relative max-w-5xl w-full h-[90vh] bg-neutral-950 border border-white/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl z-[100000]"
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => {
                                if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                                    window.focus();
                                    modalRef.current?.focus();
                                }
                            }}
                            onMouseMove={() => {
                                if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                                    window.focus();
                                    modalRef.current?.focus();
                                }
                            }}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-white/10 shrink-0 relative z-50">
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setLightboxOpen(false);
                                        }}
                                        className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center group cursor-pointer border-0 p-0 shrink-0 relative z-50"
                                        title="Tutup pratinjau (ESC)"
                                    >
                                        <i className="fas fa-times text-[9px] text-white opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </button>
                                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/90" />
                                    <span className="w-3.5 h-3.5 rounded-full bg-green-500/90" />
                                    <span className="text-xs font-mono font-bold text-white ml-1.5 truncate">
                                        {currentExp.title} — {currentExp.role} ({currentExp.year})
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 relative z-50">
                                    {/* Mode Selector Switcher */}
                                    {driveFileId && (
                                        <div className="flex bg-neutral-800 p-1 rounded-lg border border-white/10 text-xs font-mono">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalViewMode('pdf');
                                                }}
                                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${modalViewMode === 'pdf'
                                                    ? 'bg-red-500 text-white font-bold shadow'
                                                    : 'text-neutral-400 hover:text-white'
                                                    }`}
                                            >
                                                <i className="fas fa-file-pdf text-xs" />
                                                <span>PDF Scroll</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalViewMode('image');
                                                }}
                                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${modalViewMode === 'image'
                                                    ? 'bg-red-500 text-white font-bold shadow'
                                                    : 'text-neutral-400 hover:text-white'
                                                    }`}
                                            >
                                                <i className="fas fa-image text-xs" />
                                                <span>Foto</span>
                                            </button>
                                        </div>
                                    )}

                                    {currentExp.certificate && (
                                        <a
                                            href={currentExp.certificate}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono hover:bg-red-500/30 transition-colors"
                                        >
                                            <span>Drive Tab Baru</span>
                                            <i className="fas fa-external-link-alt text-[10px]" />
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setLightboxOpen(false);
                                        }}
                                        className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-red-500/80 hover:text-white text-neutral-300 flex items-center justify-center border border-white/10 transition-all cursor-pointer ml-1 active:scale-95 z-50 pointer-events-auto"
                                        aria-label="Tutup pratinjau"
                                        title="Tutup pratinjau (ESC)"
                                    >
                                        <i className="fas fa-times text-xs pointer-events-none" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body Container */}
                            <div className="flex-1 bg-black/90 relative overflow-hidden flex items-center justify-center">
                                {modalViewMode === 'pdf' && driveFileId && iframeLoading && (
                                    <div className="absolute inset-0 z-10 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 pointer-events-auto">
                                        <div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                        <div className="text-center space-y-1">
                                            <p className="text-xs font-mono font-semibold text-white">Memuat Dokumen Google Drive...</p>
                                            <p className="text-[11px] text-neutral-400">Silakan tunggu sebentar atau tampilkan foto instan</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalViewMode('image');
                                            }}
                                            className="mt-1 px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                                        >
                                            <i className="fas fa-image text-xs" />
                                            <span>Tampilkan Foto Instan</span>
                                        </button>
                                    </div>
                                )}

                                {modalViewMode === 'pdf' && driveFileId ? (
                                    <iframe
                                        src={`https://drive.google.com/file/d/${driveFileId}/preview`}
                                        className="w-full h-full rounded-b-xl border-0 relative z-0"
                                        title={currentExp.title}
                                        allow="autoplay"
                                        onLoad={() => setIframeLoading(false)}
                                    />
                                ) : (
                                    <div className="w-full h-full overflow-y-auto flex items-center justify-center p-4">
                                        <img
                                            src={currentExp.image}
                                            alt={currentExp.title}
                                            onError={(e) => {
                                                if (e.target.src !== PLACEHOLDER_IMAGE && !e.target.src.endsWith(PLACEHOLDER_IMAGE)) {
                                                    e.target.src = PLACEHOLDER_IMAGE;
                                                }
                                            }}
                                            className="max-w-full h-auto max-h-none rounded-lg shadow-2xl object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}



