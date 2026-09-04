import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { scrollToSection } from '../utils/scrollToSection';
import './NotFound.css';

const NotFound = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const navigate = useNavigate();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle navigation back to home and scroll to section if hash exists
  const handleNavigateToHome = (hash = '') => {
    navigate('/', { replace: false });
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Canvas starfield / digital grid animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles
    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw & update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(239, 68, 68, ${Math.max(0.1, Math.min(0.9, p.alpha))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );

      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.nf-description',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.nf-actions',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.nf-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 25;
    const y = (clientY / innerHeight - 0.5) * 25;
    setMousePos({ x, y });
  };

  return (
    <div className="nf-wrapper" onMouseMove={handleMouseMove} ref={containerRef}>
      <canvas ref={canvasRef} className="nf-canvas" />

      {/* Glow Orbs background */}
      <div className="nf-glow nf-glow-1" />
      <div className="nf-glow nf-glow-2" />

      <div className="nf-container">
        {/* Top Tag */}
        <div className="nf-badge" ref={badgeRef}>
          <span className="nf-pulse-dot"></span>
          <span className="nf-badge-text">ERROR 404 // SIGNAL LOST IN SPACE</span>
        </div>

        {/* Big Interactive 404 Visual */}
        <div
          className="nf-hero-number"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
          }}
        >
          <span className="nf-num nf-num-left" ref={titleRef}>
            4
          </span>
          <div className="nf-zero-container">
            <span className="nf-num nf-zero">0</span>
            <div className="nf-astronaut">
              <i className="fa-solid fa-compass fa-spin" style={{ animationDuration: '12s' }}></i>
            </div>
          </div>
          <span className="nf-num nf-num-right">4</span>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="nf-title">Halaman Tidak Ditemukan</h1>
        <p className="nf-description">
          Waduh! Sepertinya Anda tersesat di ruang hampa digital. Halaman yang Anda cari mungkin
          telah dipindahkan, dihapus, atau memang tidak pernah ada.
        </p>

        {/* Primary CTA Buttons */}
        <div className="nf-actions">
          <button className="nf-btn nf-btn-primary" onClick={() => handleNavigateToHome('')}>
            <i className="fa-solid fa-house"></i>
            <span>Kembali ke Beranda</span>
          </button>
          <button className="nf-btn nf-btn-secondary" onClick={() => handleNavigateToHome('#contact')}>
            <i className="fa-solid fa-paper-plane"></i>
            <span>Laporkan Error</span>
          </button>
        </div>

        {/* Quick Nav Cards */}
        <div className="nf-quick-links">
          <p className="nf-quick-title">Atau jelajahi bagian portofolio berikut:</p>
          <div className="nf-grid">
            <div className="nf-card" onClick={() => handleNavigateToHome('#biodata')}>
              <div className="nf-card-icon">
                <i className="fa-solid fa-user-astronaut"></i>
              </div>
              <div className="nf-card-info">
                <h4>Tentang Riko</h4>
                <p>Pelajari profil & background</p>
              </div>
              <i className="fa-solid fa-arrow-right nf-arrow"></i>
            </div>

            <div className="nf-card" onClick={() => handleNavigateToHome('#project')}>
              <div className="nf-card-icon">
                <i className="fa-solid fa-laptop-code"></i>
              </div>
              <div className="nf-card-info">
                <h4>Lihat Projects</h4>
                <p>Portofolio karya & aplikasi</p>
              </div>
              <i className="fa-solid fa-arrow-right nf-arrow"></i>
            </div>

            <div className="nf-card" onClick={() => handleNavigateToHome('#work-experience')}>
              <div className="nf-card-icon">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <div className="nf-card-info">
                <h4>Pengalaman</h4>
                <p>Sertifikat & jejak karir</p>
              </div>
              <i className="fa-solid fa-arrow-right nf-arrow"></i>
            </div>

            <div className="nf-card" onClick={() => handleNavigateToHome('#contact')}>
              <div className="nf-card-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="nf-card-info">
                <h4>Hubungi Saya</h4>
                <p>Kirim pesan & kolaborasi</p>
              </div>
              <i className="fa-solid fa-arrow-right nf-arrow"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
