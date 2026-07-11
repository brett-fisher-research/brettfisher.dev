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
              A calm, local-first time tracker for macOS and Windows. Free to
              use, with optional paid cross-device sync.
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
        <div className="featured__card">
          <a
            href="https://github.com/brett-fisher-research/brot-os"
            target="_blank"
            rel="noopener noreferrer"
            className="featured__media"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
            <img
              src="/projects/brot-os-cover.png"
              alt="The brot-os cover: a colorful fractal set against a starry night sky"
              width={680}
              height={453}
            />
          </a>
          <div className="featured__body">
            <h2>Brot OS</h2>
            <p>
                A virtual OS for AI-driven workflows. It lets you manage all your projects with AI from a single directory
                and sync your workspace across devices.
            </p>
            <a
              href="https://github.com/brett-fisher-research/brot-os"
              target="_blank"
              rel="noopener noreferrer"
              className="featured__link"
            >
              github.com/brett-fisher-research/brot-os →
            </a>
          </div>
        </div>
        <div className="featured__card">
          <a
            href="https://github.com/brett-fisher-research/blackjack_rust"
            target="_blank"
            rel="noopener noreferrer"
            className="featured__media"
          >
            {/* Animated hero; static frame for prefers-reduced-motion. */}
            <picture>
              <source
                media="(prefers-reduced-motion: reduce)"
                srcSet="/projects/blackjack-hero.png"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images; <picture> enables the reduced-motion swap */}
              <img
                src="/projects/blackjack-hero.gif"
                alt="The Blackjack game: a dealt hand with red chips bet on a purple table"
                width={680}
                height={510}
              />
            </picture>
          </a>
          <div className="featured__body">
            <h2>Blackjack Rust</h2>
            <p>
              A pixel-art blackjack you can play in the browser or on desktop,
              built in Rust with macroquad. 
            </p>
            <a
              href="https://github.com/brett-fisher-research/blackjack_rust"
              target="_blank"
              rel="noopener noreferrer"
              className="featured__link"
            >
              github.com/brett-fisher-research/blackjack_rust →
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
