import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const QUICK_LINKS = [
  { label: 'Home', href: '#beranda' },
  { label: 'About', href: '#biodata' },
  { label: 'Projects', href: '#project' },
  { label: 'Contact', href: '#contact' },
];

const SOCIAL_LINKS = [
  { icon: 'fab fa-github', href: 'https://github.com/rikorizky', label: 'GitHub Irvan Afriandi' },
  { icon: 'fab fa-twitter', href: 'https://x.com/sir_ikoo', label: 'Twitter Riko Rizky' },
  { icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/riko.basawara', label: 'Facebook Irvan Afriandi' },
  { icon: 'fab fa-instagram', href: 'https://instagram.com/callme_ikoo', label: 'Instagram callme_ikoo' },
  { icon: 'fab fa-linkedin', href: 'https://id.linkedin.com/in/riko-rizky-baswara-921262338', label: 'LinkedIn Irvan Afriandi' },
];

export default function Footer() {
  const footerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-top-glow', {
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(gridRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.footer-bottom', {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-bottom',
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi untuk menangani klik pada Quick Links
  const handleQuickLinkClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-top-glow" />
      <div className="footer-bg-orb footer-bg-orb--1" />
      <div className="footer-bg-orb footer-bg-orb--2" />

      <div className="footer-inner">
        <div ref={gridRef} className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-header">
              {/* ========== DIUBAH ========== */}
              <img
                src="/img/profil.webp"
                alt="Irvan Afriandi – Web Developer & Frontend Engineer"
                className="footer-avatar"
                itemProp="image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'footer-avatar';
                  fallback.textContent = 'RR';
                  e.target.parentNode.replaceChild(fallback, e.target);
                }}
              />
              {/* ========== END DIUBAH ========== */}
              <h3 itemProp="name">Irvan Afriandi</h3>
            </div>
            <p>
              Pengembang web yang penuh semangat yang berfokus pada penciptaan
              pengalaman web yang indah dan fungsional.
            </p>
            <div className="footer-socials">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={social.label}
                  itemProp="sameAs"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleQuickLinkClick(e, link.href)}
                  >
                    <span className="footer-link-dot" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-envelope" />
                <a href="mailto:rikorizky20@gmail.com" itemProp="email">rikorizky20@gmail.com</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt" />
                <span itemProp="homeLocation">Cirebon, Jawa Barat, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} - Riko Rizky. All Rights Reserved.
          </p>
          <button type="button" className="footer-top-btn" onClick={scrollToTop} aria-label="Back to top">
            <i className="fas fa-arrow-up" />
          </button>
        </div>
      </div>
    </footer>
  );
}