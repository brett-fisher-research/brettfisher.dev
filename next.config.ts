import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit <route>/index.html (directory URLs) so pages keep their old Jekyll
  // trailing-slash URLs (e.g. /posts/:slug/) and satisfy the index.html layout.
  // Routes with a file extension (e.g. /feed.xml) are exempt and unaffected.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
