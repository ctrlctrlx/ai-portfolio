"use client";

import { useParams } from "next/navigation";
import { isValidLocale } from "@/src/lib/i18n";

export default function LocalizedError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ lang?: string }>();
  const locale =
    typeof params.lang === "string" && isValidLocale(params.lang)
      ? params.lang
      : "zh";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {locale === "zh" ? "页面暂时无法显示" : "This page is temporarily unavailable"}
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
        {locale === "zh"
          ? "请稍后重试。"
          : "Please try again in a moment."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg px-4 py-2 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {locale === "zh" ? "重试" : "Try again"}
      </button>
    </div>
  );
}
