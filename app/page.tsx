import Link from "next/link";
import { getAllPosts, groupByYear } from "@/lib/posts";

function formatDate(date: string): string {
  // date is YYYY-MM-DD; render as e.g. "Sep 23, 2024" using UTC to avoid drift
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function Home() {
  const groups = groupByYear(getAllPosts());

  return (
    <>
      <section className="intro">
        <h1>Posts</h1>
        <p className="subscribe">
          <a href="/feed.xml">Subscribe via RSS</a>
        </p>
      </section>

      {groups.map((group) => (
        <section className="year-group" key={group.year}>
          <h2>{group.year}</h2>
          <ul className="post-list">
            {group.posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="post-list__link">
                  {post.title}
                </Link>
                <span className="post-list__date">{formatDate(post.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
