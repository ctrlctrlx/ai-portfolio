import Link from "next/link";
import { ArrowLeft, Compass, FileText, FolderKanban, Mail, UserRound } from "lucide-react";
import { headers } from "next/headers";
import type { ElementType } from "react";
import { defaultLocale, isValidLocale } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";

/** 单条快捷入口：只存文案与路由，图标按路径在组件内映射，字典保持纯文案 */
interface NotFoundQuickLink {
  href: string;
  label: string;
}

/**
 * 404 页面双语文案。
 * 单独抽成字典，新增语种时只需补一份，组件内不散落文案。
 */
interface NotFoundCopy {
  title: string;
  description: string;
  hint: string;
  backHome: string;
  quickNavLabel: string;
  quickLinks: NotFoundQuickLink[];
}

const notFoundCopy: Record<Locale, NotFoundCopy> = {
  zh: {
    title: "页面不存在",
    description: "抱歉，你访问的链接可能已失效或地址输入有误。",
    hint: "如果你是招聘方，可先访问「关于我」与「项目经历」快速了解我的背景与成果。",
    backHome: "返回首页",
    quickNavLabel: "快捷导航",
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
    hint: "If you are a recruiter, you can view About and Projects to learn about my background and achievements.",
    backHome: "Back to home",
    quickNavLabel: "Quick navigation",
    quickLinks: [
      { href: "/about", label: "About Me" },
      { href: "/projects", label: "Projects" },
      { href: "/resume", label: "Resume" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

/** 快捷入口图标：与首页 / 导航栏同类入口保持一致 */
const quickLinkIcons: Record<string, ElementType> = {
  "/about": UserRound,
  "/projects": FolderKanban,
  "/resume": FileText,
  "/contact": Mail,
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

      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        {copy.backHome}
      </Link>

      {/*
        面向招聘方的快捷导航卡片：位于「返回首页」按钮下方，
        卡片风格与全站一致，移动端两列、sm 起四列，避免横向溢出。
        按钮沿用全站现有按钮样式（边框 + 主题色 hover），无额外动画。
      */}
      <section
        className="mt-8 rounded-2xl border p-5 text-left sm:p-6"
        style={{
          background: "var(--card)",
          borderColor: "var(--card-border)",
        }}
        aria-label={copy.quickNavLabel}
      >
        <div className="flex items-start gap-3">
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

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {copy.quickLinks.map((link) => {
            const Icon = quickLinkIcons[link.href] ?? Compass;
            return (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href}`}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:bg-[var(--tag-bg)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  <Icon size={15} aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
