import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Keep compression explicitly enabled for self-hosted `next start`.
  compress: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.labimacademy.com" }],
        destination: "https://labimacademy.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        // Cache public static assets longer to reduce repeat fetches.
        source: "/:path*\\.(js|css|png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
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
