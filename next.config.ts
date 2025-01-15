import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
};

export default nextConfig;


module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Disables linting during the build process
  },
};