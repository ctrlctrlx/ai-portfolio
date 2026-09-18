"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/src/lib/i18n";
import {
  getContactHref,
  getPublicContact,
  publicIdentity,
} from "@/src/data/profile";
import { getFooterDictionary } from "@/src/data/site/footer";

type VisitorResponse =
  | { available: true; count: number }
  | { available: false };

/**
 * 全站页脚。
 *
 * - 双语：全部文案来自 src/data/site/footer.ts，组件内不硬编码文案。
 * - 版权 + 免责声明 + 最后由 git 提交时间派生的「最后更新」。
 * - 保留站内导航、公开邮箱与微信等联系方式、访客计数。
 * - 样式沿用主题令牌（--card-border / --muted / --foreground / --accent），
 *   移动端单列堆叠，桌面端分栏并排。
 */
export default function Footer({ lang }: { lang: Locale }) {
  const [count, setCount] = useState<number | null>(null);
  const publicEmail = getPublicContact("email");
  const dictionary = getFooterDictionary(lang);

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

  const name =
    publicIdentity?.name[lang] ?? (lang === "zh" ? "作品集" : "Portfolio");
  const showLastUpdated =
    dictionary.lastUpdatedLabel !== null && dictionary.lastUpdatedValue !== null;

  return (
    <footer
      className="mt-20 border-t py-10 text-xs"
      style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* 品牌 + 版权 */}
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {name}
            </p>
            <p className="mt-2 leading-5">{dictionary.copyright}</p>
          </div>

          {/* 站内导航 */}
          <nav aria-label={dictionary.navHeading}>
            <h2
              className="text-xs font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {dictionary.navHeading}
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
              {dictionary.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="hover:underline"
                    style={{ color: "var(--muted)" }}
                  >
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 联系方式 */}
          <div>
            <h2
              className="text-xs font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {dictionary.contactHeading}
            </h2>
            <ul className="mt-3 space-y-2">
              {publicEmail && (
                <li>
                  <a
                    href={getContactHref(publicEmail)}
                    className="break-all hover:underline"
                    style={{ color: "var(--muted)" }}
                    aria-label={dictionary.emailAriaLabel(publicEmail.value)}
                  >
                    {publicEmail.value}
                  </a>
                </li>
              )}
              {dictionary.extraContacts.map((contact) => (
                <li key={contact.id} className="break-all">
                  {contact.label[lang]}：{contact.value}
                </li>
              ))}
              {count !== null && (
                <li className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: "#4ade80",
                      boxShadow: "0 0 6px #4ade80",
                      animation:
                        "visitor-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                    }}
                  />
                  <span>{dictionary.visitors(count.toLocaleString())}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* 免责声明 + 最后更新 */}
        <div
          className="mt-8 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p className="leading-5">{dictionary.disclaimer}</p>
          {showLastUpdated && (
            <p className="whitespace-nowrap">
              {dictionary.lastUpdatedLabel}：{dictionary.lastUpdatedValue}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
