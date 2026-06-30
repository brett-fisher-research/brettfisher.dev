import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Brett Fisher.",
  openGraph: {
    title: "About",
    description: "About Brett Fisher.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <article className="post-content">
      <h1>About</h1>
      <p>
      I write a lot, usually not on this blog. The perspective I try to take is that "essay" means a "try" or "attempt".
      </p> 
      <p>
      I'm not writing to get an A in a class. I write to write.
      </p>
    </article>
  );
}
