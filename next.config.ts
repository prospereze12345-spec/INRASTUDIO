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
        destination: "https://inrabackend-docker.onrender.com/api/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "https://inrabackend-docker.onrender.com/api/:path*/",
      },
    ];
  },
images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      // ADD THIS — missing entirely, this is why the flyer image is blocked
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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


