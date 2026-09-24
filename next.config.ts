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
  /**
   * 研究内容已整合进项目经历页（研究方向标签筛选 + 学术成果/专利区块），
   * 原 /[lang]/research 路由做永久重定向，保证历史链接与外链不失效。
   */
  async redirects() {
    return [
      {
        source: "/:lang(zh|en)/research",
        destination: "/:lang/projects",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
