import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Must include every `quality` value passed to `next/image` (default is 75 only).
    qualities: [60, 65, 68, 70, 72, 75],
    // Prefer modern formats for smaller payloads.
    formats: ["image/avif", "image/webp"],
    // Keep optimized images cached longer.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
