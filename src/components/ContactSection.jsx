import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';
import './ContactSection.css';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_LINKS = [
  {
    icon: 'fab fa-github',
    label: 'GitHub',
    value: '@rikorizky',
    href: 'https://github.com/rikorizky',
    color: '#ffffff',
  },
  {
    icon: 'fas fa-envelope',
    label: 'Email',
    value: 'rikorizky20@gmail.com',
    href: 'mailto:rikorizky20@gmail.com',
    color: '#dc2626',
  },
  {
    icon: 'fab fa-instagram',
    label: 'Instagram',
    value: '@sir_ikoo',
    href: 'https://instagram.com/sir_ikoo',
    color: '#e1306c',
  },
  {
    icon: 'fab fa-linkedin-in',
    label: 'LinkedIn',
    value: 'Riko Rizky',
    href: 'https://www.linkedin.com/in/riko-rizky-baswara-921262338?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    color: '#0a66c2',
  },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.contact-card', {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact-section">
      <SectionBackdrop variant="warm" />

      <div className="contact-inner">
        <div ref={headerRef} className="contact-header">
          <div className="contact-label">
            <span className="contact-line" />
            <span>Let's Connect</span>
            <span className="contact-line" />
          </div>

          <h2 className="contact-title">
            Have a project in <span>mind?</span>
          </h2>

          <p className="contact-desc">
            Saya selalu terbuka untuk kolaborasi, freelance project, atau sekadar diskusi
            seputar teknologi web. Mari ciptakan sesuatu yang luar biasa bersama.
          </p>

          <a href="mailto:rikorizky20@gmail.com" className="contact-cta">
            <span className="contact-cta-glow" />
            <i className="fas fa-paper-plane" />
            Send me an email
          </a>
        </div>

        <div ref={cardsRef} className="contact-cards">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              style={{ '--accent': link.color }}
            >
              <div className="contact-card-shine" />
              <span className="contact-card-icon">
                <i className={link.icon} />
              </span>
              <span className="contact-card-body">
                <span className="contact-card-label">{link.label}</span>
                <span className="contact-card-value">{link.value}</span>
              </span>
              <span className="contact-card-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
