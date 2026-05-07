import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
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
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; trusted-types default; upgrade-insecure-requests",
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
