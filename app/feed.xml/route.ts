import RSS from "rss";
import { getAllPosts } from "@/lib/posts";

/**
 * RSS feed at `/feed.xml`.
 *
 * `force-static` makes Next materialize this route handler to a static file
 * (`out/feed.xml`) during `output: 'export'` builds. The feed is generated at
 * build time from every post returned by `getAllPosts()` (already sorted
 * newest-first), so the item order matches the rest of the site.
 */
export const dynamic = "force-static";

const SITE_URL = "https://brettfisher.dev";

export async function GET() {
  const feed = new RSS({
    title: "Brett Fisher",
    description: "Brett Fisher's blog about software engineering and life.",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: "en",
    generator: "Next.js + rss",
  });

  for (const post of getAllPosts()) {
    feed.item({
      title: post.title,
      description: post.description ?? "",
      url: `${SITE_URL}/posts/${post.slug}`,
      guid: `${SITE_URL}/posts/${post.slug}`,
      date: post.date,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
