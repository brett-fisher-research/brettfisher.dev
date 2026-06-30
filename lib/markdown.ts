import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

/**
 * Render a markdown string to an HTML string.
 *
 * Pipeline notes:
 * - `remark-rehype` runs with `allowDangerousHtml` and `rehype-raw` reparses
 *   inline/raw HTML (e.g. `<code>…</code>` literals in old posts) into real
 *   nodes — so author HTML survives.
 * - `rehype-slug` adds `id`s to headings (anchorable).
 * - `rehype-highlight` adds `hljs` + `language-*` classes and wraps tokens in
 *   `<span class="hljs-*">` elements. Agent A4 supplies the actual theme CSS;
 *   this just guarantees the classes are present. See {@link HIGHLIGHT_CSS_CLASS}.
 * - Images (`/assets/foo.png`) and links pass through untouched.
 */
export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);

  return String(file);
}

/**
 * The root class `rehype-highlight` puts on every highlighted `<code>` block.
 * Theme CSS (added later by Agent A4) should target `.hljs` and the
 * `.hljs-keyword`, `.hljs-string`, etc. token classes.
 */
export const HIGHLIGHT_CSS_CLASS = "hljs";
