import type { NextConfig } from "next";

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [],
  },
};

export default nextConfig;
