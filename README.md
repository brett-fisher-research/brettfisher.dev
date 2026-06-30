# brettfisher.dev

The personal site and blog of Brett Fisher — a **Next.js** (App Router, TypeScript)
static-export site, built with plain CSS.

## Deployment

Deployed via **GitHub Pages** from this repo (`brett-fisher-research/brettfisher.dev`)
and served at the custom domain **[brettfisher.dev](https://brettfisher.dev)** (set via
the `public/CNAME` file, emitted to `out/CNAME` on build).

## Local development

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
npm run test    # vitest unit tests + bash tests under tests/
```

## Layout

| Path           | What it holds                                  |
|----------------|------------------------------------------------|
| `app/`         | Next.js App Router routes and layout           |
| `_posts/`      | Blog posts (Markdown)                          |
| `lib/`         | Post listing + Markdown rendering helpers      |
| `public/`      | Static assets served at `/` (images, CNAME)    |
| `tests/`       | vitest (`*.test.ts`) + bash (`*.sh`) tests     |
| `public/CNAME` | Custom domain (`brettfisher.dev`)              |
