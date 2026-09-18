import { headers } from "next/headers";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { defaultLocale, isValidLocale } from "@/src/lib/i18n";
import { getSiteUrl } from "@/src/lib/siteUrl";

async function getRequestLocale() {
  const localeHeader = (await headers()).get("x-portfolio-locale");
  return localeHeader && isValidLocale(localeHeader)
    ? localeHeader
    : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    metadataBase: getSiteUrl(),
    title: locale === "zh" ? "页面未找到" : "Page not found",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html
      lang={locale}
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
