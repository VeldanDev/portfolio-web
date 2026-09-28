import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /dashboard merged into the home page's "Live Stats" section
      { source: "/dashboard", destination: "/#stats", permanent: true },
    ];
  },
};

export default nextConfig;
