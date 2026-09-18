import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { headers } from "next/headers";
import { defaultLocale, isValidLocale } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";

/**
 * 404 页面双语文案。
 * 单独抽成字典，新增语种时只需补一份，组件内不散落文案。
 */
interface NotFoundCopy {
  title: string;
  description: string;
  hint: string;
  backHome: string;
  quickLinks: Array<{ href: string; label: string }>;
}

const notFoundCopy: Record<Locale, NotFoundCopy> = {
  zh: {
    title: "页面不存在",
    description: "抱歉，你访问的链接可能已失效或地址输入有误。",
    hint: "如果你是招聘方，可先访问「关于我」与「项目经历」快速了解我的背景与成果。",
    backHome: "返回首页",
    quickLinks: [
      { href: "/about", label: "关于我" },
      { href: "/projects", label: "项目经历" },
      { href: "/resume", label: "在线简历" },
      { href: "/contact", label: "联系我" },
    ],
  },
  en: {
    title: "Page not found",
    description: "Sorry, this link may have expired or the address was mistyped.",
    hint: "If you are a recruiter, start with About and Projects for a quick overview of my background and results.",
    backHome: "Back to home",
    quickLinks: [
      { href: "/about", label: "About" },
      { href: "/projects", label: "Projects" },
      { href: "/resume", label: "Resume" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

/**
 * 本地化 404。
 * 沿用原有的 x-portfolio-locale 请求头判定语言，不改变路由行为；
 * 使用主页一致的卡片与按钮样式，无动画。
 */
export default async function LocalizedNotFound() {
  const localeHeader = (await headers()).get("x-portfolio-locale");
  const locale: Locale =
    localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale;
  const copy = notFoundCopy[locale];

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
        404
      </p>
      <h1
        className="mt-3 text-3xl font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {copy.title}
      </h1>
      <p className="mt-4 text-sm leading-7" style={{ color: "var(--muted)" }}>
        {copy.description}
      </p>

      {/* 面向招聘方的友好提示 */}
      <div
        className="mt-6 flex items-start gap-3 rounded-2xl border p-4 text-left"
        style={{
          background: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      >
        <Compass
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: "var(--accent)" }}
          aria-hidden="true"
        />
        <p className="text-sm leading-7" style={{ color: "var(--muted)" }}>
          {copy.hint}
        </p>
      </div>

      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        {copy.backHome}
      </Link>

      {/* 常用入口，避免访客走到死路 */}
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        {copy.quickLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={`/${locale}${link.href}`}
              className="hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
