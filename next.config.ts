import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy tuned to what the site loads:
// - Font Awesome CSS + webfonts from cdnjs
// - Vercel Analytics (same-origin /_vercel/insights, debug script on va.vercel-scripts.com)
// - Next.js needs inline scripts/styles for hydration (no nonce setup), and eval in dev
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  "font-src 'self' data: https://cdnjs.cloudflare.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://va.vercel-scripts.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Optimal configuration for Vercel deployment
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
  },
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  output: "standalone", // Required for Vercel App Router
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

// withBotId adds the rewrites that let the BotID challenge script reach Vercel.
export default withBotId(nextConfig);
