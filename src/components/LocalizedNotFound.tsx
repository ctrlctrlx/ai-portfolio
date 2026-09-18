import Link from "next/link";
import { headers } from "next/headers";
import { defaultLocale, isValidLocale } from "@/src/lib/i18n";

export default async function LocalizedNotFound() {
  const localeHeader = (await headers()).get("x-portfolio-locale");
  const locale =
    localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
        404
      </p>
      <h1
        className="mt-3 text-3xl font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {locale === "zh" ? "页面未找到" : "Page not found"}
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
        {locale === "zh"
          ? "你访问的页面不存在，或已停止公开展示。"
          : "The page you requested does not exist or is no longer publicly available."}
      </p>
      <Link
        href={`/${locale}`}
        className="inline-flex mt-8 px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {locale === "zh" ? "返回首页" : "Back to home"}
      </Link>
    </main>
  );
}
