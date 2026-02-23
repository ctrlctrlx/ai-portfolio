import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow .mdx as page extensions for future direct MDX routing
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default nextConfig;
