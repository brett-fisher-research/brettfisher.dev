// Minimal local type declarations for the `rss` package (no @types/rss
// published). Scoped to this route so it doesn't leak into lib/.
declare module "rss" {
  interface FeedOptions {
    title: string;
    description?: string;
    feed_url?: string;
    site_url: string;
    generator?: string;
    language?: string;
    pubDate?: Date | string;
    [key: string]: unknown;
  }
  interface ItemOptions {
    title: string;
    description?: string;
    url: string;
    guid?: string;
    date: Date | string;
    [key: string]: unknown;
  }
  export default class RSS {
    constructor(options: FeedOptions);
    item(options: ItemOptions): this;
    xml(options?: { indent?: boolean | string }): string;
  }
}
