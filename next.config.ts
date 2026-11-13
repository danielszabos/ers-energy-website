import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Don't write AI agent instruction files into the project.
  agentRules: false,
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Any local image, with any query: photos carry a ?v= version (lib/assets).
    localPatterns: [{ pathname: "/**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
