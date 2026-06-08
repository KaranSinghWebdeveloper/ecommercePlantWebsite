import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.6",
    "http://192.168.0.6:3000",
    "http://localhost:5000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Image optimization for better Core Web Vitals
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h
  },
  // Compress responses
  compress: true,
  // Power by header (security)
  poweredByHeader: false,
  // Enable strict mode for better React performance
  reactStrictMode: true,
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  // Redirects for SEO (old URLs)
  async redirects() {
    return [
      // Redirect trailing slash for cleaner canonical URLs
      {
        source: "/category/:slug/",
        destination: "/category/:slug",
        permanent: true,
      },
      {
        source: "/product/:slug/",
        destination: "/product/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
