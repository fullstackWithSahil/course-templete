import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'buisnesstools-course.b-cdn.net',
      },
    ],
  },
};

export default nextConfig;
