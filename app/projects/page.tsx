import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects Brett Fisher has built.",
  openGraph: {
    title: "Projects",
    description: "Projects Brett Fisher has built.",
    url: "/projects",
  },
};

type Project = {
  name: string;
  href: string;
  blurb: string;
};

// Future smaller repos / freelance work land here.
const moreProjects: Project[] = [];

export default function ProjectsPage() {
  return (
    <>
      <section className="intro">
        <h1>Projects</h1>
      </section>

      <section className="featured">
        <p className="section-label">Featured</p>
        <div className="featured__card">
          <a
            href="https://duree.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="featured__media"
          >
            {/* Animated hero; static frame for prefers-reduced-motion. */}
            <picture>
              <source
                media="(prefers-reduced-motion: reduce)"
                srcSet="/projects/duree-hero.png"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images; <picture> enables the reduced-motion swap */}
              <img
                src="/projects/duree-hero.gif"
                alt="The Duree app window: a running timer with a sidebar of tracked activities"
                width={680}
                height={383}
              />
            </picture>
          </a>
          <div className="featured__body">
            <h2>Duree</h2>
            <p>
              A calm, local-first time tracker for macOS and Windows. My paid
              product — free to use, with optional cross-device sync.
            </p>
            <a
              href="https://duree.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="featured__link"
            >
              duree.dev →
            </a>
          </div>
        </div>
      </section>

      {moreProjects.length > 0 && (
        <section className="more-projects">
          <p className="section-label">More</p>
          <ul className="post-list">
            {moreProjects.map((project) => (
              <li key={project.name}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-list__link"
                >
                  {project.name}
                </a>
                <span className="post-list__date">{project.blurb}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
