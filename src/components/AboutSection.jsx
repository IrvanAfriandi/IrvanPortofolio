import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SLIDE_DATA } from './Karya';
import { rawExperiences } from './ProfessionalBackgroundSection';
import { scrollToSection } from '../utils/scrollToSection';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

const PROFILE_PHOTO = '/img/profil.jpeg';

const SKILL_CATEGORIES = [
  {
    title: 'Programming Language',
    emoji: '💻',
    skills: [
      { name: 'JavaScript', fa: 'fab fa-js', color: '#f7df1e', darkIcon: true },
      { name: 'React', fa: 'fab fa-react', color: '#61dafb' },
      { name: 'HTML', fa: 'fab fa-html5', color: '#e44d26' },
      { name: 'PHP', fa: 'fab fa-php', color: '#8892be' },
      { name: 'Python', fa: 'fab fa-python', color: '#3776ab' },
    ],
  },
  {
    title: 'Framework',
    emoji: '🧩',
    skills: [
      { name: 'Laravel', fa: 'fab fa-laravel', color: '#ff2d20' },
      { name: 'CSS', fa: 'fab fa-css3-alt', color: '#264de4' },
      { name: 'Tailwind', fa: 'fab fa-css3-alt', color: '#0ea5e9' },
      { name: 'Bootstrap', fa: 'fab fa-bootstrap', color: '#7952b3' },
    ],
  },
  {
    title: 'Database',
    emoji: '🗄️',
    skills: [
      { name: 'MySQL', fa: 'fas fa-database', color: '#00758f' },
      { name: 'PostgreSQL', fa: 'fas fa-database', color: '#336791' },
    ],
  },
  {
    title: 'Microsoft Platform',
    emoji: '📊',
    skills: [
      { name: 'Excel', fa: 'fas fa-table-cells', color: '#217346' },
      { name: 'Power BI', fa: 'fas fa-chart-column', color: '#f2c811', darkIcon: true },
      { name: 'Power Automate', fa: 'fas fa-arrows-rotate', color: '#0066ff' },
      { name: 'Power Apps', fa: 'fas fa-mobile-screen-button', color: '#742774' },
      { name: 'Power Query', fa: 'fas fa-filter', color: '#1f6f8b' },
      { name: 'DAX', fa: 'fas fa-calculator', color: '#1f4e79' },
    ],
  },
  {
    title: 'Tools',
    emoji: '🛠️',
    skills: [
      { name: 'VS Code', fa: 'fas fa-code', color: '#007acc' },
      { name: 'Git', fa: 'fab fa-git-alt', color: '#f05032' },
      { name: 'GitHub', fa: 'fab fa-github', color: '#000000' },
    ],
  },
];

const startYear = 2025;
const currentYear = new Date().getFullYear();
const yearsExperience = Math.max(1, currentYear - startYear);

const STATS = [
  { value: SLIDE_DATA.length, suffix: '+', label: 'Projects Built', icon: 'fas fa-laptop-code' },
  { value: rawExperiences.length, suffix: '+', label: 'Certifications', icon: 'fas fa-certificate' },
  { value: yearsExperience, suffix: ' Tahun+', label: 'Pengalaman Kerja', icon: 'fas fa-briefcase' },
  // { value: 100, suffix: '%', label: 'Passion Driven', icon: 'fas fa-fire' },
];

function ProfileAvatar() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="about-avatar-wrap">
      <div className="about-avatar-ring" />
      <div className="about-avatar">
        {!imgError ? (
          <img
            src={PROFILE_PHOTO}
            alt="Foto profil Irvan Afriandi – Web Developer & Frontend Engineer dari Cirebon Indonesia"
            className="about-avatar-photo"
            loading="lazy"
            decoding="async"
            width="120"
            height="120"
            itemProp="image"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="about-avatar-fallback">RR</span>
        )}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const profileRef = useRef(null);
  const rightRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(profileRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(rightRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.about-skill-chip', {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.03,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.about-skills-wrap',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      statsRef.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i]?.value || 0;
        const suffix = STATS[i]?.suffix || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      });

      sectionRef.current?.querySelectorAll('.animate-text').forEach((textEl) => {
        textEl.setAttribute('data-text', textEl.textContent.trim());
        ScrollTrigger.create({
          trigger: textEl,
          start: 'top 65%',
          end: 'bottom 40%',
          scrub: 1,
          onUpdate: (self) => {
            const clip = Math.max(0, 100 - self.progress * 100);
            textEl.style.setProperty('--clip-value', `${clip}%`);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="biodata"
      className="about-section"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="about-section-glow about-section-glow--orange" />
      <div className="about-section-glow about-section-glow--amber" />
      <div className="about-grid-pattern" />

      <div className="about-section-inner">
        <div className="about-section-header">
          <div className="about-section-label">
            <span className="about-line" />
            <span>Get to know me</span>
            <span className="about-line" />
          </div>
          <h2 className="about-section-title">
            About <span>Me</span>
          </h2>
        </div>

        <div className="about-layout">
          <div ref={profileRef} className="about-profile-col">
            <div className="about-profile-card">
              <div className="about-profile-glow" />
              <ProfileAvatar />
              <h3 className="about-profile-name" itemProp="name">Irvan Afriandi</h3>
              <p className="about-profile-role" itemProp="jobTitle">Software Engineer</p>
              <div className="about-profile-divider" />
              <ul className="about-profile-info">
                <li><i className="fas fa-map-marker-alt" /> <span itemProp="homeLocation">Surakarta, Central Java, Indonesia</span></li>
                <li><i className="fas fa-graduation-cap" /> <span itemProp="alumniOf">Bachelor's in Informatics Engineering</span></li>
              </ul>
              <div className="about-profile-socials">
                <a href="https://github.com/rikorizky" target="_blank" rel="noopener noreferrer me" aria-label="GitHub Irvan Afriandi" itemProp="sameAs">
                  <i className="fab fa-github" />
                </a>
                <a href="mailto:rikorizky20@gmail.com" aria-label="Email Irvan Afriandi" itemProp="email">
                  <i className="fas fa-envelope" />
                </a>
                <a
                  href="https://id.linkedin.com/in/riko-rizky-baswara-921262338"
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label="LinkedIn Irvan Afriandi"
                  itemProp="sameAs"
                >
                  <i className="fab fa-linkedin" />
                </a>
              </div>
            </div>
          </div>

          <div ref={rightRef} className="about-right-col">
            <p className="animate-text about-bio">
            I'm a Software Engineer with a strong foundation in web development. Beyond building responsive and functional websites, I have hands-on experience in workflow automation and dashboard development using the Microsoft Power Platform, gained through an internship in the manufacturing industry. I'm passionate about turning ideas into digital solutions that are not only visually engaging but also genuinely useful.
            </p>

            <div className="about-stats">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="about-stat-card">
                  <i className={`${stat.icon} about-stat-icon`} />
                  <p ref={(el) => (statsRef.current[i] = el)} className="about-stat-value">
                    0{stat.suffix}
                  </p>
                  <p className="about-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="about-skills-wrap">
              <div className="about-skills-head">
                <span className="about-skills-tag">Tech Stack</span>
              </div>
              <div className="about-skills-grid">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.title} className="about-skill-row">
                    <span className="about-skill-cat">
                      {cat.emoji} {cat.title}
                    </span>
                    <div className="about-skill-chips">
                      {cat.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="about-skill-chip"
                          style={{ '--chip-color': skill.color }}
                          title={skill.name}
                        >
                          {skill.fa ? (
                            <i className={`${skill.fa} ${skill.darkIcon ? 'dark-icon' : ''}`} />
                          ) : (
                            <span className="chip-letter">{skill.letter}</span>
                          )}
                          <span className="chip-name">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
