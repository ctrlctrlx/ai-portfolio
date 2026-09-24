"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/src/lib/i18n";
import {
  getFooterDictionary,
  type FooterExtraContact,
} from "@/src/data/site/footer";

/**
 * 署名、公开邮箱、荣誉板块可用性与额外联系方式均由服务端布局解析后传入。
 *
 * 本组件是客户端组件；若在此 import "@/src/data/profile"，整个双语 profile
 * 数据集都会被序列化进客户端 chunk，使英文页面的资源包里出现大量中文字符。
 */
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
export default function Footer({
  lang,
  brandName,
  copyrightName,
  email,
  phone,
  hasHonors,
  extraContacts,
}: {
  lang: Locale;
  /** 品牌署名（按 locale 解析） */
  brandName: string;
  /** 版权行署名（固定英文姓名） */
  copyrightName: string;
  /** 公开求职邮箱；无公开邮箱时传 null，该行不渲染 */
  email: string | null;
  /** 已授权公开的手机号；无该联系人时传 null，该行不渲染 */
  phone: string | null;
  hasHonors: boolean;
  extraContacts: FooterExtraContact[];
}) {
  const [count, setCount] = useState<number | null>(null);
  const dictionary = getFooterDictionary(lang, {
    name: copyrightName,
    hasHonors,
    extraContacts,
  });

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
              {brandName}
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
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="break-all hover:underline"
                    style={{ color: "var(--muted)" }}
                    aria-label={dictionary.emailAriaLabel(email)}
                  >
                    {dictionary.emailLabel}
                    {lang === "zh" ? "：" : ": "}
                    {email}
                  </a>
                </li>
              )}
              {dictionary.extraContacts.map((contact) => (
                <li key={contact.id} className="break-all">
                  {contact.label}
                  {lang === "zh" ? "：" : ": "}
                  {contact.value}
                </li>
              ))}
              {/* 电话：与邮箱、微信并列，tel: 协议支持移动端直接拨号 */}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="break-all hover:underline"
                    style={{ color: "var(--muted)" }}
                  >
                    {dictionary.phoneLabel}
                    {lang === "zh" ? "：" : ": "}
                    {phone}
                  </a>
                </li>
              )}
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
              {dictionary.lastUpdatedLabel}
              {lang === "zh" ? "：" : ": "}
              {dictionary.lastUpdatedValue}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
