import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-syntax-highlighter"],
  },
  allowedDevOrigins: ["*.space-z.ai", "preview-chat-*.space-z.ai"],
};

export default nextConfig;
