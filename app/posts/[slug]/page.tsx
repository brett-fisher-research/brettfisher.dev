import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const description = post.description ?? `${post.title} — Brett Fisher`;
  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/posts/${post.slug}`,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);

  return (
    <article>
      <Link href="/" className="post-back">
        ← All posts
      </Link>
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="post-meta">{formatDate(post.date)}</p>
      </header>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
