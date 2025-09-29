import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "npr.brightspotcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "photos.google.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;