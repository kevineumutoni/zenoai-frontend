import type { NextConfig } from 'next';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_URL: process.env.BASE_URL, // Expose BASE_URL to the app (server-side only)
  },
};

export default nextConfig;