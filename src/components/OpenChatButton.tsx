"use client";

import { MessageCircle } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";

export default function OpenChatButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-career-assistant"))}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]"
      style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
    >
      <MessageCircle size={15} aria-hidden="true" />
      {locale === "zh" ? "询问求职助理" : "Ask Career Assistant"}
    </button>
  );
}
