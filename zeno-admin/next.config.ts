const BASE_URL = process.env.BASE_URL;

import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${BASE_URL}`,
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;