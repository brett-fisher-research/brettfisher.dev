import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const nextConfig: NextConfig = {
  output: "export",
  // Pin the Turbopack workspace root to this project dir. The parent brot-os
  // macro repo has its own package-lock.json, so Next.js otherwise detects
  // multiple lockfiles and wrongly infers the brot-os root as the workspace
  // root. See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  // Emit <route>/index.html (directory URLs) so pages keep their old Jekyll
  // trailing-slash URLs (e.g. /posts/:slug/) and satisfy the index.html layout.
  // Routes with a file extension (e.g. /feed.xml) are exempt and unaffected.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
