import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Mail } from "lucide-react";
import { projects, featuredProjects, projectStories } from "@/data/projects";
import StackMap from "@/components/portfolio/StackMap";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  return {
    title: project
      ? `${project.name} — Kwame Owusu-Boakye`
      : "Project not found",
    description: project?.description,
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  const story = projectStories[slug as keyof typeof projectStories];
  if (!project || !story) notFound();
  const featuredIndex = featuredProjects.indexOf(project);
  const next = featuredProjects[(featuredIndex + 1) % featuredProjects.length];
  return (
    <div className={`portfolio case-study case-${story.accent}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link
          className="wordmark"
          href="/"
          aria-label="Kwame Owusu-Boakye home"
        >
          <Code2 size={24} strokeWidth={1.6} />
          <span>
            9naquame<span className="wordmark-dot">.</span>
          </span>
        </Link>
        <Link href="/#work" className="case-back">
          <ArrowLeft size={14} /> All projects
        </Link>
      </header>
      <main id="main">
        <section className="case-hero">
          <div className="case-breadcrumb">
            <Link href="/#work">SELECTED WORK</Link>
            <span>/</span>
            <span>{project.number}</span>
          </div>
          <div className="case-title-row">
            <h1>
              {project.name}
              <span>.</span>
            </h1>
            <a
              className="button button-secondary"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit website <ArrowUpRight size={15} />
            </a>
          </div>
          <p className="case-headline">{story.headline}</p>
          <p className="case-introduction">{story.introduction}</p>
          {project.laterRedesign && (
            <p className="case-contribution">
              My involvement was with an earlier version of this project. A
              third party handled the later redesign and subsequent technical
              decisions.
            </p>
          )}
          <div className="case-meta">
            <div>
              <span>DOMAIN</span>
              <strong>{project.category}</strong>
            </div>
            <div>
              <span>
                {project.laterRedesign ? "INVOLVEMENT" : "TECHNOLOGIES"}
              </span>
              <strong>
                {project.laterRedesign
                  ? "Earlier version"
                  : project.tags.join(" / ")}
              </strong>
            </div>
            <div>
              <span>SOURCE</span>
              <strong>Private repository</strong>
            </div>
          </div>
        </section>
        <div
          className={`case-product-image ${project.imageKind ? `case-product-${project.imageKind}` : ""}`}
        >
          {!project.imageKind && (
            <div className="case-window-bar">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>{new URL(project.url).hostname}</span>
              <ArrowUpRight size={13} />
            </div>
          )}
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.name} product interface`}
            width={1400}
            height={900}
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
        </div>
        {project.designCredit && (
          <p className="case-design-credit">{project.designCredit}</p>
        )}
        <div className="case-content">
          <section className="case-section case-context">
            <div>
              <span className="section-kicker">01 / THE CONTEXT</span>
              <h2>
                The problem
                <br />
                worth solving.
              </h2>
            </div>
            <div>
              <p className="case-lead">{story.problem}</p>
              <h3>The product</h3>
              <p>{story.product}</p>
            </div>
          </section>
          <section className="case-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">02 / THE PRODUCT</span>
                <h2>What comes together.</h2>
              </div>
            </div>
            <div className="case-capabilities">
              {story.capabilities.map((item, index) => (
                <article key={item.title}>
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
          {!project.laterRedesign && (
            <>
              <section className="case-section">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">
                      03 / UNDER THE SURFACE
                    </span>
                    <h2>The technical foundation.</h2>
                  </div>
                </div>
                <p className="case-map-caption">
                  A high-level map of the published technology stack. Select a
                  layer to explore it.
                </p>
                <StackMap
                  layers={story.stack}
                  infrastructure={story.infrastructure}
                />
              </section>
              <section className="case-section case-engineering">
                <div>
                  <span className="section-kicker">
                    04 / THE ENGINEERING LENS
                  </span>
                  <h2>Where the complexity lives.</h2>
                </div>
                <div className="case-considerations">
                  {story.focus.map((item, index) => (
                    <article key={item.title}>
                      <span>0{index + 1}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
          <section className="case-conversation">
            <div>
              <Mail size={21} />
              <h2>Let’s talk engineering.</h2>
              <p>
                {project.laterRedesign
                  ? "Interested in my earlier contribution? Let’s talk."
                  : "Curious about the thinking behind the product? Start a conversation."}
              </p>
            </div>
            <a href="mailto:kwame@owusuboakye.com"
              className="button button-primary"
            >
              Get in touch <ArrowUpRight size={15} />
            </a>
          </section>
          <Link className="case-next" href={`/work/${next.slug}`}>
            <div>
              <span className="section-kicker">
                NEXT PROJECT / {next.number}
              </span>
              <h2>{next.name}</h2>
            </div>
            <ArrowRight size={32} strokeWidth={1.3} />
          </Link>
        </div>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Kwame Owusu-Boakye</span>
        <Link href="/#work">
          Back to selected work <ArrowUpRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
