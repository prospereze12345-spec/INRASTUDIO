import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination:
          "https://inrabackend-docker.onrender.com/api/:path*/",
      },
      {
        source: "/api/:path*",
        destination:
          "https://inrabackend-docker.onrender.com/api/:path*/",
      },
    ];
  },

  images: {
    // Serve modern image formats automatically.
    // Helps reduce image payload size, especially on mobile.
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      // Production Django media files
      {
        protocol: "https",
        hostname: "inrabackend-docker.onrender.com",
        pathname: "/media/**",
      },

      // Cloudinary production images
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },

      // External placeholder images
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },

  transpilePackages: ["motion"],

  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === "true") {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    return config;
  },
};

export default nextConfig;


