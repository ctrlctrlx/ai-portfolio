"use client";

import { Printer } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";

export default function PrintResumeButton({ locale }: { locale: Locale }) {
  const label =
    locale === "zh" ? "打印 / 保存为 PDF" : "Print / Save as PDF";

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hidden inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[var(--card)]"
      style={{
        borderColor: "var(--card-border)",
        color: "var(--foreground)",
      }}
      aria-label={label}
    >
      <Printer size={15} aria-hidden="true" />
      {label}
    </button>
  );
}
