import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
      {
        protocol: "https",
        hostname: "cdn-images-2.medium.com",
      },
      {
        protocol: "https",
        hostname: "*.medium.com",
      },
    ],
  },

  serverExternalPackages: [],

  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;