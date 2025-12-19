"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, ChevronDown, Award, Briefcase, GraduationCap, Code2, Heart, Menu, X, Folder, Lock } from "lucide-react";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];

const skills = {
  languages: ["Python (Flask, FastAPI)", "PHP (Laravel)", "Java", "C#", "Scala", "C/C++", "JavaScript/TypeScript (ReactJS, Node.js)"],
  frameworks: ["React Native/ReactJS", "Flask/FastAPI/Laravel", "TensorFlow/PyTorch (AI/ML)", "Hadoop/Spark (Big Data)"],
  cloud: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "Ansible", "Vault", "Consul", "Jenkins", "CI/CD"],
  databases: ["PostgreSQL", "MySQL", "SQLite", "Microsoft SQL Server", "MongoDB", "Firebase", "Amazon Aurora", "Amazon Redshift", "Redis", "DynamoDB"],
  embedded: ["Embedded Development (Microcontrollers)", "ASIC Design/VHDL"],
  other: ["Git", "LaTeX"],
};

const experience = [
  {
    title: "Senior Manager Software Engineering",
    company: "Nasdaq Verafin",
    period: "07/2025 - Present",
    location: "St John's, NL, Canada",
    achievements: [
      "Managing conversion projects where banks are moved from classic data integration platform to scalable EDP platform",
      "Accessing code and project risks to ensure successful migrations",
      "Liaising with other teams to resolve data modelling issues",
      "Providing leadership and strategic direction for integration projects",
    ],
  },
  {
    title: "Senior Software Developer",
    subtitle: "(formerly Data Integration Developer)",
    company: "Nasdaq Verafin",
    period: "06/2021 - 07/2025",
    location: "St John's, NL, Canada",
    achievements: [
      "Utilizing Scala, Spark-SQL, and AWS services to address integration challenges in client data lake environments",
      "Addressing operational cases for clients involving banking systems like Core, ACH, Wire, and Check21",
      "Conducting QA testing on solutions to resolve customer issues in production",
      "Developing test code for Jenkins build automation to optimize deployment processes",
      "Aiding in the onboarding process for new developers within the team",
      "Reviewing code for risks, promptly addressing issues to safeguard software integrity",
    ],
  },
  {
    title: "Software Development Manager",
    company: "Zentech IT Solutions Limited",
    period: "01/2017 - 08/2019",
    location: "Accra, Ghana",
    achievements: [
      "Enhanced Payroll/HR modules within the ZenHRM system with Employee Self-Service, Claims, and Loan Management",
      "Integrated LDAP authentication for enterprise directory services and centralized user management",
      "Created a recruitment module to expand ZenHRM capabilities",
      "Engaged with customers to discuss and implement software improvements",
      "Provided leadership to developers by assigning tasks and maintaining code quality",
      "Orchestrated continuous integration and deployment processes",
    ],
  },
  {
    title: "Software Developer",
    company: "National Trust Holding Company Limited",
    period: "09/2012 - 12/2016",
    location: "Accra, Ghana",
    achievements: [
      "Spearheaded development and enhancement of diverse investment products",
      "Implemented system administration protocols, optimizing server performance",
      "Executed critical database administrative duties including backup strategies and schema design",
      "Oversaw Linux systems and network infrastructure operations",
      "Supervised team members and established clear objectives",
    ],
  },
];

const certifications = [
  { name: "AWS Certified DevOps Engineer – Professional", date: "Expires Jan 13, 2028" },
  { name: "AWS Certified SysOps Administrator – Associate", date: "Expires Jan 13, 2028" },
  { name: "AWS Certified Developer – Associate", date: "Expires Jan 13, 2028" },
  { name: "AWS Certified Data Engineer – Associate", date: "Expires May 21, 2028" },
  { name: "AWS Certified Machine Learning Engineer – Associate", date: "Expires Jun 1, 2028" },
  { name: "AWS Certified AI Practitioner", date: "Expires Jun 1, 2028" },
  { name: "AWS Certified Cloud Practitioner", date: "Expires Jun 1, 2028" },
  { name: "HashiCorp Certified: Terraform Associate (003)", date: "Expires Jul 1, 2026" },
  { name: "Accelerating Manager Potential", date: "Issued Nov 27, 2025" },
];

const projects = [
  {
    title: "Skill Match AI",
    description: "AI-powered career and hiring intelligence platform that connects job seekers and employers based on skills and experience using machine learning and resume analysis.",
    tech: ["React", "FastAPI", "PostgreSQL", "OpenAI", "SerpAPI", "NotificationAPI", "Jenkins", "Docker", "JavaScript", "Python"],
    github: "https://github.com/9naquame/skill-match-ai",
    demo: "https://skillmatchai.ca/",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-16-at-15.56.00-1765913166812.png?width=8000&height=8000&resize=contain",
  },
  {
    title: "TransactIQ",
    description: "All-in-one donation and financial tracking platform for churches and charities with automated tax receipt generation and contribution management.",
    tech: ["Docker", "React", "FastAPI", "PostgreSQL", "NotificationAPI", "Kubernetes", "Jenkins", "Terraform", "JavaScript", "Python"],
    isPrivate: true,
    demo: "https://www.transactiq.ca",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-16-at-15.29.57-1765911609687.png?width=8000&height=8000&resize=contain",
  },
    {
      title: "Rivet Sales Blueprint Builder",
      description: "Structured end-to-end sales strategy system designed to help early-stage and founder-led companies build traction and grow revenue faster through tailored GTM plans.",
      tech: ["Docker", "NextJS", "LangGraph", "AWS", "OpenAI", "MongoDB", "FastAPI", "Kubernetes", "TypeScript", "Python"],
      demo: "https://demo.salesblueprintbuilder.ai/",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-16-at-16.38.29-1765915718283.png?width=8000&height=8000&resize=contain",
    },
];

const volunteer = [
  {
    title: "DevOps Engineer",
    organization: "Inkling Ops.",
    period: "08/2023 - Present",
    description: "Creators of Meno, a mobile devotional app. Overseeing AWS Cloud infrastructure with Terraform, managing release automation with AWS CodeBuild/CodePipeline and Kubernetes.",
  },
  {
    title: "Volunteer",
    organization: "Google Developer Group",
    period: "02/2022 - Present",
    location: "St John's, NL, Canada",
    description: "Contributing to planning and execution of DevFest events, managing registrations, coordinating speaker arrangements, and mentoring new developers.",
  },
];

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-xl font-semibold tracking-tight">
              <span className="text-emerald-400">K</span>OB
            </a>
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <button
              className="md:hidden text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111113] border-b border-white/5">
            <div className="px-6 py-4 space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="opacity-0 animate-fade-in-up">
              <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">SENIOR MANAGER - SOFTWARE ENGINEERING</p>
            </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 opacity-0 animate-fade-in-up stagger-1">
            Kwame{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-x">
              Owusu-Boakye
            </span>
          </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up stagger-2">
              A senior full-stack engineer with 10+ years of experience architecting data platforms, high-throughput backend services, and modern web interfaces, with a strong foundation in data engineering, cloud architecture, cryptography, and mathematical systems.
            </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 opacity-0 animate-fade-in-up stagger-3">
            <a
              href="mailto:koowusuboakye@gmail.com"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-full transition-all hover:scale-105"
            >
              <Mail size={18} />
              Get in Touch
            </a>
            <a
              href="https://github.com/9naquame"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 rounded-full transition-all hover:scale-105"
            >
              <Github size={18} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/9naquame"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 rounded-full transition-all hover:scale-105"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>
          <a
            href="#about"
            className="inline-flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 animate-fade-in-up stagger-4"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="animate-bounce" size={20} />
          </a>
        </div>
      </section>

      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">ABOUT ME</p>
                <h2 className="text-4xl font-bold mb-6">Building Solutions That Scale</h2>
                <p className="text-zinc-400 mb-4 leading-relaxed">
                  With over a decade of programming experience, I specialize in crafting robust software solutions that address complex business challenges. My expertise spans from low-level embedded systems to high-scale cloud architectures.
                </p>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Currently serving as a Senior Manager at Nasdaq Verafin, I lead conversion projects migrating banks from legacy platforms to scalable solutions while managing risks and collaborating across teams to resolve complex data challenges.
                </p>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <MapPin size={18} className="text-emerald-400" />
                    <span>Newfoundland and Labrador, Canada</span>
                  </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-[#111113] border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-emerald-400" size={24} />
                  <h3 className="text-xl font-semibold">Education</h3>
                </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">MASc Computer Engineering</h4>
                      <p className="text-zinc-400 text-sm">Memorial University of Newfoundland</p>
                      <p className="text-zinc-500 text-sm">09/2019 - 06/2021 | St John&apos;s, NL, Canada</p>
                    </div>
                    <div>
                      <h4 className="font-medium">BSc Computer Engineering</h4>
                      <p className="text-zinc-400 text-sm">University of Ghana</p>
                      <p className="text-zinc-500 text-sm">08/2008 - 05/2012 | Legon, Accra, Ghana</p>
                    </div>
                  </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <a
                    href="https://www.credly.com/users/9naquame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Award size={18} />
                    <span>View all credentials on Credly</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 px-6 bg-[#0d0d0e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">TECHNICAL EXPERTISE</p>
            <h2 className="text-4xl font-bold">Skills & Technologies</h2>
          </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Code2 className="text-emerald-400" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Programming Languages</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <svg className="text-cyan-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Frameworks & Libraries</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.frameworks.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="text-blue-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Cloud & Infrastructure</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.cloud.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="text-purple-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Databases & Data Platforms</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.databases.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <svg className="text-orange-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Embedded & Hardware</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.embedded.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Briefcase className="text-amber-400" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Other Tools</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.other.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      <section id="experience" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">CAREER PATH</p>
            <h2 className="text-4xl font-bold">Work Experience</h2>
          </div>
          <div className="space-y-8">
            {experience.map((job, index) => (
              <div
                key={index}
                className="relative bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-emerald-500/30 transition-all group"
              >
                <div className="absolute top-8 left-0 w-1 h-12 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {job.title}
                      {job.subtitle && <span className="text-zinc-500 text-base font-normal"> {job.subtitle}</span>}
                    </h3>
                    <p className="text-emerald-400">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 font-mono text-sm">{job.period}</p>
                    <p className="text-zinc-500 text-sm">{job.location}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {job.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        </section>

        <section id="projects" className="py-32 px-6 bg-[#0d0d0e]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">PERSONAL WORK</p>
              <h2 className="text-4xl font-bold">Projects</h2>
            </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
                    >
                      {project.image ? (
                        <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 overflow-hidden">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                              <Folder className="text-blue-400" size={20} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                          <Folder className="text-blue-400" size={48} />
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-xl font-semibold">{project.title}</h3>
                          {project.isPrivate && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-400">
                              <Lock size={12} />
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 mb-4 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                          <div className="flex gap-4">
                            {project.isPrivate ? (
                              project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
                                >
                                  <ExternalLink size={16} />
                                  Website
                                </a>
                              )
                            ) : (
                              project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
                                >
                                  <ExternalLink size={16} />
                                  Demo
                                </a>
                              )
                            )}
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
          </div>
        </section>

        <section id="certifications" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">CREDENTIALS</p>
            <h2 className="text-4xl font-bold">Certifications</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-[#111113] border border-white/5 rounded-xl p-6 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="text-emerald-400" size={24} />
                </div>
                <h3 className="font-medium text-sm mb-2 leading-tight">{cert.name}</h3>
                <p className="text-zinc-500 text-xs font-mono">{cert.date}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Professional Development</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                <h4 className="font-medium mb-2">Leadership Bootcamp</h4>
                <p className="text-emerald-400 text-sm mb-2">Nasdaq Verafin</p>
                <p className="text-zinc-500 text-xs font-mono mb-3">12/2023 - 02/2024</p>
                <p className="text-zinc-400 text-sm">Intensive program on communication, team building, conflict resolution, and strategic decision-making.</p>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                <h4 className="font-medium mb-2">Dale Carnegie Course</h4>
                <p className="text-emerald-400 text-sm mb-2">Dale Carnegie Training</p>
                <p className="text-zinc-500 text-xs font-mono mb-3">05/2022 - 09/2022</p>
                <p className="text-zinc-400 text-sm">Focused on communication, leadership, public speaking, persuasion, and relationship building.</p>
              </div>
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                <h4 className="font-medium mb-2">AWS Architecture Workshop</h4>
                <p className="text-emerald-400 text-sm mb-2">AWS Training & Certification</p>
                <p className="text-zinc-500 text-xs font-mono mb-3">05/2022</p>
                <p className="text-zinc-400 text-sm">Workshop on AWS cloud architecture principles including scalability, security, and high availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">GIVING BACK</p>
            <h2 className="text-4xl font-bold">Volunteer Experience</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {volunteer.map((vol, index) => (
              <div
                key={index}
                className="bg-[#111113] border border-white/5 rounded-2xl p-8 hover:border-pink-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Heart className="text-pink-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vol.title}</h3>
                    <p className="text-pink-400 text-sm">{vol.organization}</p>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm font-mono mb-3">
                  {vol.period} {vol.location && `| ${vol.location}`}
                </p>
                <p className="text-zinc-400">{vol.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 bg-[#0d0d0e]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider">GET IN TOUCH</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let&apos;s Work Together</h2>
          <p className="text-zinc-400 mb-12 max-w-2xl mx-auto">
            I&apos;m always interested in hearing about new opportunities, challenging projects, or just having a conversation about technology and software development.
          </p>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <a
                href="mailto:koowusuboakye@gmail.com"
                className="flex items-center gap-3 px-6 py-4 bg-[#111113] border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all group"
              >
                <Mail className="text-emerald-400 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <p className="text-xs text-zinc-500">Email</p>
                  <p className="font-medium">koowusuboakye@gmail.com</p>
                </div>
              </a>
            </div>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/9naquame"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/9naquame"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.credly.com/users/9naquame"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
            >
              <Award size={20} />
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} @9naquame. All rights reserved.
            </p>
          <p className="text-zinc-600 text-sm">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
