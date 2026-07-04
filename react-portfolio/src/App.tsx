import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

type NavKey = 'home' | 'services' | 'resume' | 'portfolio' | 'contact';

type Service = {
  title: string;
  description: string;
  icon: string; // boxicons class
};

type Project = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
};

type ResumeKey = 'experience' | 'education' | 'skills' | 'about';

type ResumeSection = {
  key: ResumeKey;
  label: string;
};

const navItems: { key: NavKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'resume', label: 'Resume' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'contact', label: 'Contact' },
];


const services: Service[] = [
  {
    title: 'Web Development',
    description: 'Responsive websites built with modern HTML, CSS, and JavaScript.',
    icon: 'bx bx-code-alt',
  },
  {
    title: 'Python Development',
    description: 'Automation, scripting, and data-driven solutions using Python.',
    icon: 'bx bx-code',
  },
  {
    title: 'Cybersecurity',
    description: 'Security mindset for building safer applications and systems.',
    icon: 'bx bx-shield',
  },
  {
    title: 'AI Integration',
    description: 'Applied AI concepts to improve productivity and capabilities.',
    icon: 'bx bx-brain',
  },
  {
    title: 'UI/UX Design',
    description: 'Clean interfaces with a focus on usability and accessibility.',
    icon: 'bx bx-paint',
  },
  {
    title: 'Graphic Design',
    description: 'Premium visuals and branding for modern digital products.',
    icon: 'bx bx-camera',
  },
];

const resumeMenu: ResumeSection[] = [
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'about', label: 'About Me' },
];

const projects: Project[] = [
  {
    title: 'EmotionNet',
    description: 'A Python-based emotion recognition project with a focus on robust preprocessing.',
    technologies: ['Python', 'Machine Learning', 'Computer Vision'],
    githubUrl: '#',
  },
  {
    title: 'Python Network Sniffer',
    description: 'Packet capture and analysis tool for learning network behavior and security.',
    technologies: ['Python', 'Networking', 'Security'],
    githubUrl: '#',
  },
  {
    title: 'Browser Chat Application',
    description: 'Real-time messaging UI built with clean frontend architecture.',
    technologies: ['JavaScript', 'WebSockets', 'HTML/CSS'],
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    title: 'Law Firm Management System',
    description: 'A structured management system with role-based organization.',
    technologies: ['Python', 'SQL', 'Security'],
    githubUrl: '#',
  },
  {
    title: 'POS System',
    description: 'A practical point-of-sale project built for learning workflows.',
    technologies: ['Python', 'Databases', 'UI'],
    githubUrl: '#',
  },
  {
    title: 'Luntha Technology Website',
    description: 'A responsive website concept with modern layout and branding.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: '#',
  },
];

function useSmoothScrollAndActiveNav() {
  const [activeNav, setActiveNav] = useState<NavKey>('home');

  useEffect(() => {
    const sectionEls = navItems
      .map((item) => document.getElementById(item.key))
      .filter(Boolean) as HTMLElement[];

    const navIndex = new Map<HTMLElement, NavKey>();
    navItems.forEach((item) => {
      const el = document.getElementById(item.key);
      if (el) navIndex.set(el, item.key);
    });

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible) return;
        const key = navIndex.get(visible.target as HTMLElement);
        if (key) setActiveNav(key);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('header nav a[data-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const key = a.getAttribute('data-nav') as NavKey | null;
        if (!key) return;
        document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }, []);

  return activeNav;
}

function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index] ?? '';
    const speed = deleting ? 30 : 60;

    const t = window.setTimeout(() => {
      if (!deleting && subIndex === current.length) {
        window.setTimeout(() => setDeleting(true), 900);
        return;
      }

      if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % texts.length);
        return;
      }

      setSubIndex((s) => (deleting ? s - 1 : s + 1));
    }, speed);

    return () => window.clearTimeout(t);
  }, [deleting, index, subIndex, texts]);

  return (
    <span className="typing">
      {texts[index].slice(0, subIndex)}
      <span className="cursor">|</span>
    </span>
  );
}

export default function App() {
  const activeNav = useSmoothScrollAndActiveNav();
  const [resumeKey, setResumeKey] = useState<ResumeKey>('experience');
  const [projectIndex, setProjectIndex] = useState(0);

  const currentProject = useMemo(() => projects[projectIndex], [projectIndex]);
  const prev = () => setProjectIndex((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setProjectIndex((i) => (i + 1) % projects.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [projects.length]);

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="#home" data-nav="home">
          Nobutu Nayoto.
        </a>

        <nav className="nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              data-nav={item.key}
              className={activeNav === item.key ? 'active' : ''}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className="section homeSection">
          <div className="homeGrid">
            <div className="homeLeft">
              <h3 className="small">Hello</h3>
              <h1 className="title">I&apos;m Nobutu Nayoto</h1>
              <h2 className="subtitle">
                <span>Role: </span>
                <TypingText
                  texts={[
                    'Computer Science Student',
                    'Cybersecurity analysis',
                    'Python Developer',
                    'Web Developer',
                    'frontend Developer',
                    "software developer",
                    "Adobe Photoshop",
                    "Adobe Illustrator",
                    "Adobe After Effects",
                  ]}
                />
              </h2>
              <p className="bio">
                Passionate about cybersecurity, web development, AI, and building secure software
                solutions.
              </p>

              <div className="ctaRow">
                <a className="btn" href="Nobutu_Nayoto_CV.pdf" onClick={(e) => e.preventDefault()}>
                  Download CV
                </a>

                <div className="social">
                  <a href="#" aria-label="github" onClick={(e) => e.preventDefault()}>
                    <i className="bx bxl-github" />
                  </a>
                  <a href="#" aria-label="linkedin" onClick={(e) => e.preventDefault()}>
                    <i className="bx bxl-linkedin" />
                  </a>
                  <a href="#" aria-label="twitter" onClick={(e) => e.preventDefault()}>
                    <i className="bx bxl-twitter" />
                  </a>
                  <a href="#" aria-label="youtube" onClick={(e) => e.preventDefault()}>
                    <i className="bx bxl-youtube" />
                  </a>
                </div>
              </div>
            </div>

            <div className="homeRight">
              <div className="avatarWrap">
                <div className="ring" />
                <div className="avatar">
                  <img src="/images/profile.jpg.jpeg" alt="Nobutu" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <h2 className="heading">
            My <span>Service</span>
          </h2>

          <div className="grid servicesGrid">
            {services.map((s) => (
              <article key={s.title} className="card serviceCard">
                <div className="cardTop">
                  <div className="serviceIcon">
                    <i className={s.icon} />
                  </div>
<button className="arrowBtn" type="button" aria-label="open service" title="open service">
                    Open service
                    <i className="bx bx-right-arrow-alt" />
                  </button>
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="resume" className="section">
          <div className="resumeLayout">
            <aside className="resumeMenu">
              {resumeMenu.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={resumeKey === item.key ? 'active' : ''}
                  onClick={() => setResumeKey(item.key)}
                  title={item.label}
                >
                  {item.label}
                </button>
              ))}
            </aside>

            <div className="resumeContent">
              {resumeKey === 'experience' && (
                <div className="contentBlock">
                  <h2 className="heading">
                    My <span>Experience</span>
                  </h2>
                  <div className="grid resumeCards">
                    {[
                      { year: '2024 - present', role: 'Frontend Developer', company: 'CodeAlpha' },
                      { year: '2025 - present', role: 'Full-stack Developer', company: 'CodeAlpha' },
                      { year: '2025 - present', role: 'Web Developer', company: 'Cybrary' },
                      { year: '2025 - 2026', role: 'Junior Developer', company: 'Coursera' },
                    ].map((x) => (
                      <article key={x.role} className="card resumeCard">
                        <p className="year">{x.year}</p>
                        <h3>{x.role}</h3>
                        <p className="company">{x.company}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {resumeKey === 'education' && (
                <div className="contentBlock">
                  <h2 className="heading">
                    My <span>Education</span>
                  </h2>
                  <div className="timeline">
                    {[
                      { year: '2024 - 2026', title: 'B.Sc. Computer Science', place: 'DMI St-Eugene University' },
                      { year: '2024 - 2025', title: 'Python Programming', place: 'DMI St-Eugene University' },
                      { year: '2024 - 2025', title: 'Java Programming', place: 'DMI St-Eugene University' },
                      { year: '2025 - 2026', title: 'C Programming', place: 'DMI St-Eugene University' },
                      { year: '2025 - 2026', title: 'C++ Programming', place: 'DMI St-Eugene University' },
                    ].map((t) => (
                      <div key={t.title} className="timelineItem">
                        <div className="dot" />
                        <div>
                          <p className="year">{t.year}</p>
                          <h3>{t.title}</h3>
                          <p className="company">{t.place}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeKey === 'skills' && (
                <div className="contentBlock">
                  <h2 className="heading">
                    My <span>Skills</span>
                  </h2>
                  <div className="skillsWrap">
                    {[
                      { label: 'Python', value: 80 },
                      { label: 'Java', value: 75 },
                      { label: 'HTML', value: 85 },
                      { label: 'CSS', value: 80 },
                      { label: 'JavaScript', value: 68 },
                      { label: 'Networking', value: 46 },
                      { label: 'Linux', value: 72 },
                      { label: 'Git', value: 80 },
                      { label: 'SQL', value: 74 },
                      { label: 'Cybersecurity', value: 52 },
                      { label: 'AI', value: 58 },
                    ].map((s) => (
                      <div key={s.label} className="skillRow">
                        <div className="skillHead">
                          <span>{s.label}</span>
                          <span className="pct">{s.value}%</span>
                        </div>
                        <div className="bar">
                          <div className="barFill" style={{ width: `${s.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeKey === 'about' && (
                <div className="contentBlock">
                  <h2 className="heading">
                    About <span>Me</span>
                  </h2>
                  <p className="aboutText">
                    I&apos;m a cybersecurity-focused developer who turns ideas into secure, responsive
                    products. I enjoy learning, building, and improving interfaces with performance
                    and accessibility in mind.
                  </p>
                  <div className="aboutGrid">
                    {[
                      ['Name', 'Nobutu Nayoto'],
                      ['Gender', 'Male'],
                      ['Full Time', 'Available'],
                      ['Phone', '(+260) 772 131 446'],
                      ['Email', 'Nazarinayoto@gmail.com'],
                      ['Languages', 'English, local languages'],
                    ].map(([k, v]) => (
                      <div key={k} className="aboutItem">
                        <span className="k">{k}</span>
                        <span className="v">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="portfolio" className="section">
          <h2 className="heading">
            Portfolio <span>Projects</span>
          </h2>

          <div className="portfolioLayout">
            <div className="portfolioLeft">
              <div className="projectMeta">
                <p className="projectNo">{String(projectIndex + 1).padStart(2, '0')}</p>
                <h3 className="projectTitle">{currentProject.title}</h3>
                <p className="projectDesc">{currentProject.description}</p>

                <div className="techList">
                  {currentProject.technologies.map((t) => (
                    <span key={t} className="techTag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="projectButtons">
                  <a className="btn secondary" href={currentProject.githubUrl} onClick={(e) => e.preventDefault()}>
                    GitHub
                  </a>
                  <a
                    className="btn secondary"
                    href={currentProject.liveUrl ?? currentProject.githubUrl}
                    onClick={(e) => e.preventDefault()}
                  >
                    Live Demo
                  </a>
                </div>

                <div className="pager">
<button className="pagerBtn" type="button" onClick={prev} title="Previous project">
                    <i className="bx bx-chevron-left" />
                  </button>
                  <button className="pagerBtn" type="button" onClick={next} title="Next project">
                    <i className="bx bx-chevron-right" />
                  </button>
                </div>
              </div>
            </div>

            <div className="portfolioRight">
              <div key={currentProject.title} className="shot fadeSlide">
                <img src="/images/profile.jpg.jpeg" alt="project" />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="contactLayout">
            <div className="contactLeft">
              <h2 className="heading">
                Let&apos;s <span>Work</span> Together
              </h2>
              <div className="contactInfo">
                <div className="infoRow">
                  <i className="bx bxs-phone" />
                  <div>
                    <p className="label">Phone</p>
                    <p className="value">(+260) 772 131 446</p>
                  </div>
                </div>
                <div className="infoRow">
                  <i className="bx bx-envelope" />
                  <div>
                    <p className="label">Email</p>
                    <p className="value">nazarinayoto@gmail.com</p>
                  </div>
                </div>
                <div className="infoRow">
                  <i className="bx bx-map" />
                  <div>
                    <p className="label">Address</p>
                    <p className="value">Your City, Country</p>
                  </div>
                </div>
              </div>

              <div className="social large">
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="github">
                  <i className="bx bxl-github" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="linkedin">
                  <i className="bx bxl-linkedin-square" />
                </a>
              </div>
            </div>

            <div className="contactRight">
              <form
                className="contactForm"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <h3 className="formTitle">
                  Contact <span>Me!</span>
                </h3>

                <div className="fields">
                  <input placeholder="Full Name" required />
                  <input placeholder="Email Address" required type="email" />
                  <input placeholder="Phone Number" required />
                  <input placeholder="Email Subject" required />
                  <textarea placeholder="Your Message" required />
                </div>

                <button className="btn glow" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Nobutu Nayoto</span>
      </footer>

      {/* boxicons */}
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
    </div>
  );
}

