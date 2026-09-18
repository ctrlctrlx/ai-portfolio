"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/src/lib/i18n";
import {
  getContactHref,
  getPublicContact,
  publicIdentity,
} from "@/src/data/profile";

type VisitorResponse =
  | { available: true; count: number }
  | { available: false };

export default function Footer({ lang }: { lang: Locale }) {
  const [count, setCount] = useState<number | null>(null);
  const publicEmail = getPublicContact("email");

  useEffect(() => {
    fetch("/api/visitor", { method: "POST" })
      .then((response) => {
        if (!response.ok) throw new Error("visitor service unavailable");
        return response.json() as Promise<VisitorResponse>;
      })
      .then((data) => {
        if (data.available && Number.isSafeInteger(data.count) && data.count >= 0) {
          setCount(data.count);
        }
      })
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
          {publicIdentity?.name[lang] ?? (lang === "zh" ? "作品集" : "Portfolio")} ·{" "}
          {lang === "zh" ? "证据导向的双语作品集" : "Evidence-based bilingual portfolio"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          {publicEmail && (
            <a
              href={getContactHref(publicEmail)}
              className="hover:underline"
              aria-label={
                lang === "zh"
                  ? `发送邮件至公开求职邮箱 ${publicEmail.value}`
                  : `Email the public contact address ${publicEmail.value}`
              }
            >
              {publicEmail.value}
            </a>
          )}
          {count !== null && (
            <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
                animation: "visitor-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
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
      </div>
    </footer>
  );
}
