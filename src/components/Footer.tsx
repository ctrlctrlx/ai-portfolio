"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/src/lib/i18n";

export default function Footer({ lang }: { lang: Locale }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visitor", { method: "POST" })
      .then((r) => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => {});
  }, []);

  return (
    <footer
      className="border-t mt-20 py-8"
      style={{ borderColor: "var(--card-border)" }}
    >
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{ color: "var(--muted)" }}
      >
        <p>
          © {new Date().getFullYear()}{" "}
          {lang === "zh" ? "杨冲" : "Mingyuan Yang"} ·{" "}
          {lang === "zh" ? "基于 Next.js & DeepSeek 构建" : "Built with Next.js & DeepSeek"}
        </p>

        {count !== null && (
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
                animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
            <span>
              {lang === "zh"
                ? `全球访客 ${count.toLocaleString()} 人次`
                : `${count.toLocaleString()} global visitors`}
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}
