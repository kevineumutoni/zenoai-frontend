import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zeno-ai-be14a438528a.herokuapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;