import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { defaultLocale } from "@/src/lib/i18n";
import { getSiteUrl } from "@/src/lib/siteUrl";

/**
 * 根布局：只做静态可判定的工作，不读取任何请求态数据。
 *
 * 重要约束：这里**不能**调用 `headers()` / `cookies()` 等动态 API。
 * 一旦调用，整棵路由树会被强制改为「按请求渲染」，页面级 `generateStaticParams`
 * 全部失效，`.next` 中不会产出任何页面 HTML（首屏只能走 Node 渲染、无法 CDN 缓存）。
 *
 * 因此：
 * - `<html lang>` 用 `defaultLocale` 输出，真实语言由 `DocumentLocale`
 *   （客户端组件，挂在 `app/[lang]/layout.tsx`）在 hydration 时按当前路由校正；
 * - 根级 metadata 只保留静态可判定的 `metadataBase` 与兜底标题，
 *   各页面的语言相关标题/描述由各自 `generateMetadata` 提供；
 * - 本地化 404 文案仍由 `src/components/LocalizedNotFound.tsx` 按请求头判定，
 *   只影响 404 边界，不会波及正常页面的静态生成。
 */
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "页面未找到",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* JS 被禁用时正文不会渲染（动态页面依赖客户端水合），此处给出明确提示 */}
        <noscript>
          <div
            style={{
              margin: 0,
              padding: "0.75rem 1rem",
              background: "#fef3c7",
              color: "#78350f",
              borderBottom: "1px solid #fcd34d",
              fontFamily: '"Segoe UI", "Microsoft YaHei", Arial, system-ui, sans-serif',
              fontSize: "0.875rem",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            请开启 JavaScript 以正常浏览本站。 / Please enable JavaScript to browse this
            site properly.
          </div>
        </noscript>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
