import { describe, it, expect } from "vitest";
import { renderMarkdown, HIGHLIGHT_CSS_CLASS } from "../../lib/markdown";

const FIXTURE = `# Heading

Here is some \`inline\` text and an inline <code>raw()</code> tag.

\`\`\`js
const x = 1;
console.log(x);
\`\`\`

![profile](/assets/foo.png)

A [link](https://example.com) here.
`;

describe("renderMarkdown", () => {
  it("renders all four required features correctly", async () => {
    const html = await renderMarkdown(FIXTURE);

    // 1. fenced code block: highlighted with hljs + language class
    expect(html).toContain(HIGHLIGHT_CSS_CLASS);
    expect(html).toMatch(/class="[^"]*hljs[^"]*language-js/);
    expect(html).toContain("console");

    // 2. inline raw <code>…</code> HTML preserved
    expect(html).toContain("<code>raw()</code>");

    // 3. /assets/ image preserved with correct src
    expect(html).toMatch(/<img[^>]+src="\/assets\/foo\.png"/);

    // 4. link preserved with href
    expect(html).toMatch(/<a[^>]+href="https:\/\/example\.com"/);
  });

  it("emits hljs token spans inside code blocks", async () => {
    const html = await renderMarkdown("```js\nconst x = 1;\n```\n");
    expect(html).toMatch(/<span class="hljs-/);
  });
});
