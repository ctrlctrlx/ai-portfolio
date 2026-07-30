import { headers } from "next/headers";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { defaultLocale, isValidLocale } from "@/src/lib/i18n";

async function getRequestLocale() {
  const localeHeader = (await headers()).get("x-portfolio-locale");
  return localeHeader && isValidLocale(localeHeader)
    ? localeHeader
    : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
