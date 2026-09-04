import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WorkExperienceSection.css';

gsap.registerPlugin(ScrollTrigger);

const WORK_EXPERIENCE = [
  {
    id: 2,
    year: '2025',
    month: 'Nov 2025 - May 2026',
    role: 'Internship (MagangHub 2025 Batch 2)',
    title: 'PT Bridgestone Tire Indonesia',
    issuer: 'Karawang, West Java',
    icon: 'fa-industry',
    description: [
      'Led the development and deployment of the 1D1OP digital monitoring system across 9 production sections using Microsoft Power Platform, eliminating paper usage and reducing data processing time from one week to real-time.',
    ],
    tags: ['Microsoft Power Platform', 'Power Automate', 'Power BI'],
  },
  {
    id: 1,
    year: '2024',
    month: 'Oct 2024 - Feb 2025',
    role: 'Apprentice',
    title: 'Komisi Pemilihan Umum Kabupaten Cirebon',
    issuer: 'Cirebon, West Java',
    icon: 'fa-building-columns',
    description: [
      'Managed a database of over 26,600 election committee members and supported HR administration, voter education, logistics, and on-site monitoring throughout the Cirebon regional election (Pilkada).',
    ],
    tags: ['Data Processing', 'Google Forms', 'Administrative Support'],
  },
];

export default function WorkExperienceSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.work-experience-reveal', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work-experience" className="work-experience-section">
      <div className="work-experience-inner">
        <header className="work-experience-header work-experience-reveal">
          <div className="work-experience-eyebrow">MY PROFESSIONAL JOURNEY</div>
          <h2>Work <span>Experience</span></h2>
          <p>Pengalaman profesional yang membentuk cara saya membangun produk digital.</p>
        </header>

        <div className="work-experience-timeline">
          {WORK_EXPERIENCE.map((experience) => (
            <article key={experience.id} className="work-experience-card work-experience-reveal">
              <div className="work-experience-dot" aria-hidden="true" />
              <div className="work-experience-year-month">
                <span className="work-experience-month">{experience.month}</span>
                <span className="work-experience-year">{experience.year}</span>
              </div>
              <div className="work-experience-content">
                <div className="work-experience-meta">
                  <span>{experience.role}</span>
                  <span>{experience.category}</span>
                </div>
                <h3>{experience.title}</h3>
                <p className="work-experience-company">{experience.issuer}</p>
                <ul className="work-experience-description">
                  {experience.description.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <div className="work-experience-tags">
                  {experience.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}