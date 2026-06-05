import { ContactTrigger } from "@/components/portfolio/Contact";
import Image from "next/image";
import Link from "next/link";
import { featuredProjects, otherProjects } from "@/data/projects";
import { communityGroups } from "@/data/community";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUpRight,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  ChevronDown,
  GraduationCap,
  AudioLines,
  Globe2,
  HeartHandshake,
  Code2,
} from "lucide-react";

const experience = [
  {
    company: "Nasdaq Verafin",
    monogram: "N",
    className: "nasdaq",
    period: "2021 — Present",
    role: "Senior Manager, Software Engineering",
    note: "Fintech & data platforms",
    roles: [
      {
        title: "Senior Manager, Software Engineering",
        dates: "Jul 2025 — Present",
        text: "Leading engineering delivery for bank migrations to a modern Enterprise Data Platform. Partnering across engineering, product, and client teams on platform readiness, delivery, and reliability.",
      },
      {
        title: "Senior Software Developer",
        dates: "Jun 2021 — Jun 2025",
        text: "Built distributed data integration pipelines with Scala, Spark SQL, and AWS. Integrated core banking, ACH, Wire, and Check21 data, and mentored engineers through onboarding and code reviews.",
      },
    ],
  },
  {
    company: "Zentech IT Solutions",
    monogram: "Z",
    className: "zentech",
    period: "2017 — 2019",
    role: "Software Development Manager",
    note: "Enterprise software",
    roles: [
      {
        title: "Software Development Manager",
        dates: "Jan 2017 — Aug 2019",
        text: "Led development of ZenHRM enhancements across payroll, employee self-service, claims, loans, and recruitment. Worked directly with customers and strengthened delivery through CI/CD.",
      },
    ],
  },
  {
    company: "National Trust Holding Company",
    monogram: "NTHC",
    className: "nthc",
    period: "2012 — 2016",
    role: "Software Developer",
    note: "Investment & financial systems",
    roles: [
      {
        title: "Software Developer",
        dates: "Sep 2012 — Dec 2016",
        text: "Developed financial software for investment operations, supported database design and administration, and managed Linux systems and network infrastructure.",
      },
    ],
  },
];

const expertise = [
  "Engineering leadership",
  "Platform architecture",
  "Financial systems",
  "Distributed data",
  "AWS & cloud infrastructure",
  "Python / Scala / TypeScript",
];
const credentials = [
  "DevOps Engineer · Professional",
  "Developer · Associate",
  "Data Engineer · Associate",
  "Machine Learning Engineer · Associate",
  "AI Practitioner",
];

export default function Portfolio() {
  return (
    <div className="portfolio">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="Kwame Owusu-Boakye home">
          <Code2 size={24} strokeWidth={1.6} />
          <span>
            9naquame<span className="wordmark-dot">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">
            <span className="nav-index">01</span> Work
          </a>
          <a href="#experience">
            <span className="nav-index">02</span> Experience
          </a>
          <a href="#community">
            <span className="nav-index">03</span> Community
          </a>
        </nav>
        <ContactTrigger className="header-contact">
          Let’s talk <ArrowUpRight size={15} />
        </ContactTrigger>
      </header>

      <main id="main" className="profile-shell">
        <div className="cover engineering-cover">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span /> ENGINEERING · ARCHITECTURE · LEADERSHIP
            </div>
            <p className="hero-statement">
              Complex systems.
              <br />
              <span>Clear direction.</span>
            </p>
            <div className="hero-signature">
              HANDS-ON SINCE 2012 <span>↗</span> BUILT FOR WHAT’S NEXT
            </div>
          </div>
          <div className="systems-art" aria-hidden="true">
            <svg viewBox="0 0 560 380" fill="none">
              <defs>
                <linearGradient
                  id="path-gradient"
                  x1="30"
                  y1="340"
                  x2="530"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#34d399" stopOpacity="0" />
                  <stop offset="0.55" stopColor="#34d399" />
                  <stop offset="1" stopColor="#34d399" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M30 340 280 195 530 340 280 485Z"
                stroke="#22d3ee"
                strokeOpacity=".12"
              />
              <path
                d="M30 260 280 115 530 260 280 405Z"
                stroke="#22d3ee"
                strokeOpacity=".2"
              />
              <path
                d="M30 180 280 35 530 180 280 325Z"
                stroke="url(#path-gradient)"
                strokeWidth="1.5"
              />
              <path
                d="M30 180V340M280 35V195M530 180V340M280 325V485"
                stroke="#22d3ee"
                strokeOpacity=".15"
                strokeDasharray="4 6"
              />
              <path
                d="m155 252 125-72 125 72-125 73Z"
                fill="#34d399"
                fillOpacity=".025"
                stroke="#34d399"
                strokeOpacity=".55"
              />
              <path
                d="m155 172 125-72 125 72-125 73Z"
                fill="#34d399"
                fillOpacity=".045"
                stroke="#34d399"
                strokeOpacity=".8"
              />
              <path
                d="M155 172v80m125-7v80m125-153v80"
                stroke="#34d399"
                strokeOpacity=".3"
              />
              <circle cx="280" cy="100" r="5" fill="#34d399" />
              <circle cx="155" cy="172" r="4" fill="#34d399" />
              <circle cx="405" cy="172" r="4" fill="#34d399" />
              <circle cx="280" cy="325" r="4" fill="#34d399" />
            </svg>
            <span className="art-label art-label-one">01 / PEOPLE</span>
            <span className="art-label art-label-two">02 / PLATFORMS</span>
            <span className="art-label art-label-three">03 / POSSIBILITY</span>
            <div className="art-cross art-cross-one">+</div>
            <div className="art-cross art-cross-two">+</div>
          </div>
          <span className="cover-index">SYSTEMS THINKING. HUMAN IMPACT.</span>
        </div>

        <div className="profile-content">
          <section className="profile-intro" aria-labelledby="profile-name">
            <div className="profile-topline">
              <div className="portrait">
                <Image
                  src="/images/kwame-portrait-v3.png"
                  alt="Kwame Owusu-Boakye"
                  width={144}
                  height={144}
                  priority
                />
              </div>
              <div className="profile-actions">
                <a
                  className="button button-secondary"
                  href="/Kwame-Owusu-Boakye-Resume.pdf"
                  download
                >
                  <ArrowDownToLine size={15} /> Résumé
                </a>
                <ContactTrigger className="button button-primary">
                  <Mail size={15} /> Get in touch <ArrowUpRight size={14} />
                </ContactTrigger>
              </div>
            </div>
            <div className="identity">
              <div className="identity-title">
                <h1 id="profile-name">
                  Kwame Owusu-Boakye<span>.</span>
                </h1>
                <span className="pronunciation">@9naquame</span>
              </div>
              <p className="profile-role">
                Software engineer. Architect. <span>Engineering leader.</span>
              </p>
              <p className="profile-location">
                <MapPin size={13} /> Newfoundland &amp; Labrador, Canada
              </p>
            </div>
          </section>
          <nav className="mobile-section-nav" aria-label="Portfolio sections">
            <a href="#work">
              Selected work <ArrowUpRight size={12} />
            </a>
            <a href="#experience">Experience</a>
            <a href="#community">Community</a>
          </nav>

          <section
            className="about-section section"
            id="about"
            aria-labelledby="about-heading"
          >
            <div className="about-copy">
              <div className="section-kicker">
                ABOUT / THE ENGINEER BEHIND THE WORK
              </div>
              <h2 id="about-heading">Nearly 15 years. Still building.</h2>
              <p>
                From writing financial software to architecting distributed
                platforms and leading engineering teams, I work across the full
                life of a system. Nearly 15 years in, I still care about the
                details: clear boundaries, reliable infrastructure, and software
                people can depend on.
              </p>
              <p>
                Currently a Senior Manager of Software Engineering at{" "}
                <span className="text-bright">Nasdaq Verafin</span>, helping
                teams modernize financial data platforms. Outside of that,
                you’ll find me building products, mentoring developers, and
                contributing to my community.
              </p>
              <div className="expertise-list">
                {expertise.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <aside className="profile-facts" aria-label="Profile links">
              <div className="fact">
                <span className="fact-label">Based in</span>
                <span className="fact-value">
                  <span className="canada-leaf" aria-hidden="true">
                    ✳
                  </span>{" "}
                  Newfoundland &amp; Labrador, Canada
                </span>
              </div>
              <div className="fact">
                <span className="fact-label">Working at</span>
                <a
                  href="https://verafin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nasdaq Verafin <ArrowUpRight size={13} />
                </a>
              </div>
              <div className="fact">
                <span className="fact-label">On the internet</span>
                <div className="social-links">
                  <a
                    href="https://github.com/9naquame"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={14} /> GitHub <ArrowUpRight size={12} />
                  </a>
                  <a
                    href="https://linkedin.com/in/9naquame"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin size={14} /> LinkedIn <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
              <div className="fact">
                <span className="fact-label">Say hello</span>
                <ContactTrigger className="fact-contact">
                  kwame@owusuboakye.com <ArrowUpRight size={13} />
                </ContactTrigger>
              </div>
            </aside>
          </section>

          <section
            className="section work-section"
            id="work"
            aria-labelledby="work-heading"
          >
            <div className="section-heading">
              <div>
                <div className="section-kicker">01 / SELECTED WORK</div>
                <h2 id="work-heading">
                  Selected work
                  <span className="heading-count">
                    {String(featuredProjects.length).padStart(2, "0")}
                  </span>
                </h2>
              </div>
              <span className="section-aside">Built to be useful.</span>
            </div>
            <div className="project-grid">
              {featuredProjects.map((project) => (
                <article
                  className={`project-card ${project.imageKind ? `project-${project.imageKind}` : ""}`}
                  key={project.name}
                  data-project={project.slug}
                >
                  <Link
                    className="project-image-link"
                    href={`/work/${project.slug}`}
                    aria-label={`Explore ${project.name}`}
                  >
                    <div className="project-image-stage">
                      <Image
                        src={project.image}
                        alt={
                          project.imageAlt ??
                          `${project.name} application preview`
                        }
                        width={700}
                        height={470}
                        sizes="(max-width: 650px) 90vw, (max-width: 900px) 45vw, 370px"
                        className="project-image"
                      />
                    </div>
                    <span className="project-visit">
                      <ArrowRight size={17} />
                    </span>
                  </Link>
                  <div className="project-body">
                    <span className="project-category">
                      <span>{project.number} /</span> {project.category}
                    </span>
                    <Link
                      className="project-title"
                      href={`/work/${project.slug}`}
                    >
                      <h3>{project.name}</h3>
                      <ArrowRight size={17} />
                    </Link>
                    <p>{project.description}</p>
                    {project.designCredit && (
                      <span className="project-design-credit">
                        {project.designCredit}
                      </span>
                    )}
                    <div className="project-tags">
                      {(project.laterRedesign
                        ? ["Earlier-version involvement"]
                        : project.tags
                      ).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="project-notes project-links">
                      <Link
                        href={`/work/${project.slug}`}
                        className="text-link"
                      >
                        Explore the project <ArrowRight size={14} />
                      </Link>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link"
                        aria-label={`Visit ${project.name} website`}
                      >
                        Website <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="other-projects">
              <span>EARLIER WORK</span>
              {otherProjects.map((project) => (
                <Link key={project.slug} href={`/work/${project.slug}`}>
                  {project.name}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </section>

          <section
            className="section experience-section"
            id="experience"
            aria-labelledby="experience-heading"
          >
            <div className="section-heading">
              <div>
                <div className="section-kicker">02 / EXPERIENCE</div>
                <h2 id="experience-heading">Experience</h2>
              </div>
              <a
                href="/Kwame-Owusu-Boakye-Resume.pdf"
                className="text-link"
                download
              >
                Full résumé <ArrowDownToLine size={14} />
              </a>
            </div>
            <div className="experience-grid">
              {experience.map((job) => (
                <details className="experience-card" key={job.company}>
                  <summary>
                    <div className={`company-mark ${job.className}`}>
                      {job.monogram}
                    </div>
                    <div className="experience-main">
                      <h3>{job.company}</h3>
                      <p>{job.role}</p>
                    </div>
                    <span className="experience-domain">{job.note}</span>
                    <div className="experience-meta">
                      <span>{job.period}</span>
                      <ChevronDown size={15} />
                    </div>
                  </summary>
                  <div className="experience-detail">
                    {job.roles.map((role) => (
                      <div key={role.title}>
                        <h4>{role.title}</h4>
                        <span>{role.dates}</span>
                        <p>{role.text}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section
            className="section background-section"
            aria-label="Education and credentials"
          >
            <div className="education">
              <div className="section-kicker">
                <GraduationCap size={14} /> ALWAYS LEARNING
              </div>
              <h2>Grounded in engineering.</h2>
              <div className="education-row">
                <h3>MASc, Computer Engineering</h3>
                <p>
                  Memorial University of Newfoundland <span>2019 — 2021</span>
                </p>
              </div>
              <div className="education-row">
                <h3>BSc, Computer Engineering</h3>
                <p>
                  University of Ghana <span>2008 — 2012</span>
                </p>
              </div>
            </div>
            <div className="credentials">
              <div className="credentials-heading">
                <span className="credential-mark">aws</span>
                <div>
                  <h3>Cloud, data & beyond</h3>
                  <p>Selected AWS certifications</p>
                </div>
                <a
                  href="https://www.credly.com/users/9naquame"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View credentials on Credly"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
              <div className="credential-list">
                {credentials.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <a
                className="text-link"
                href="https://www.credly.com/users/9naquame"
                target="_blank"
                rel="noopener noreferrer"
              >
                View credentials on Credly <ArrowUpRight size={13} />
              </a>
            </div>
          </section>

          <section
            className="section community-section"
            id="community"
            aria-labelledby="community-heading"
          >
            <div className="section-heading">
              <div>
                <div className="section-kicker">03 / COMMUNITY</div>
                <h2 id="community-heading">Progress is a team sport.</h2>
              </div>
              <HeartHandshake
                className="section-icon"
                size={24}
                strokeWidth={1.3}
              />
            </div>
            <div className="community-grid">
              {communityGroups.map((group) => {
                const Icon = group.id === "speaking" ? AudioLines : Globe2;
                return (
                  <article key={group.id}>
                    <div className="community-icon">
                      <Icon size={20} />
                    </div>
                    <div className="community-group-content">
                      <div className="community-group-intro">
                        <h3>{group.title}</h3>
                        <p>{group.introduction}</p>
                      </div>
                      <ul>
                        {group.entries.map((entry) => (
                          <li className="community-entry" key={entry.name}>
                            <div className="community-entry-heading">
                              <h4>
                                {entry.eventUrl ? (
                                  <a
                                    href={entry.eventUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {entry.name}
                                  </a>
                                ) : (
                                  entry.name
                                )}
                              </h4>
                              <span className="community-entry-role">
                                {entry.role}
                              </span>
                            </div>
                            <a
                              className="community-entry-org"
                              href={entry.organizationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {entry.organization}
                            </a>
                            <p className="community-entry-contribution">
                              {entry.contribution}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section
            className="contact-section"
            id="contact"
            aria-labelledby="contact-heading"
          >
            <div>
              <span className="section-kicker">
                GOOD WORK STARTS WITH A CONVERSATION
              </span>
              <h2 id="contact-heading">Let’s build what’s next.</h2>
              <p>
                A project, a possibility, or just a hello. My inbox is open.
              </p>
            </div>
            <ContactTrigger className="contact-arrow" aria-label="Email Kwame">
              <ArrowUpRight size={30} strokeWidth={1.4} />
            </ContactTrigger>
            <ContactTrigger className="contact-email">
              kwame@owusuboakye.com <ArrowRight size={17} />
            </ContactTrigger>
          </section>
        </div>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Kwame Owusu-Boakye</span>
        <span>Thoughtfully built. Always evolving.</span>
        <a href="#">
          Back to top <ArrowDown size={13} className="back-top-arrow" />
        </a>
      </footer>
    </div>
  );
}
