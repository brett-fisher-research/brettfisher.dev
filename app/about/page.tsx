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
      Hey, I'm Brett 👋 I'm a full-stack software engineer in Seattle, Washington. I first learned to code in high school
      by writing Perl scripts in Notepad, and since then I've worked full-time at Amazon and multiple startups in the 
      Seattle area. Now I do contract work for clients needing custom web applications.
      </p> 
      <p>
      When I'm not coding, I enjoy getting outside, cooking, reading, writing, and playing way too much chess.
      </p>
      <h3>Resume</h3>
      You can <a href="/BrettFisher_resume.pdf" target="_blank">download my resume here</a>.
      <h3>Contact me</h3>
      <p>
      If you'd like to contact me about business opportunities, have a question, or just have something nice to say,
      please <a href="https://forms.gle/WBsaNe5QzNPedBGv6" target="_blank">contact me here</a>.
      </p>
    </article>
  );
}
