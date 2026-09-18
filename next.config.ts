import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow .mdx as page extensions for future direct MDX routing
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    // 自动输出 AVIF / WebP 等现代格式，按浏览器能力协商，肉眼画质无明显损失
    formats: ["image/avif", "image/webp"],
    // 同一张图片的优化结果缓存 30 天，减少重复压缩开销
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
