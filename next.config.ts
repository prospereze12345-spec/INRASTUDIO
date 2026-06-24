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
        // Django's APPEND_SLASH=True will 500 on POST if the URL lacks a trailing slash
        // (it can't 301-redirect and preserve the POST body). We enforce the slash here
        // at the proxy level so Django always receives the canonical URL regardless of
        // what the client sends.
        source: "/api/:path*/",
        destination: "http://localhost:8000/api/:path*/",
      },
      // Catch URLs that arrive without a trailing slash and rewrite them with one
      // before they even reach Django — covers any caller that forgets the slash.
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*/",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
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