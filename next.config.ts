import type { NextConfig } from "next";

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
};

export default nextConfig;
