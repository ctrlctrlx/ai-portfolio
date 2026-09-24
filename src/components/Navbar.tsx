"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { getOppositeLocale, localeSwitchLabels } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";

/**
 * 数据可用性由服务端布局判定后以布尔值传入。
 *
 * 本组件是客户端组件；若在此 import "@/src/data/profile"，整个双语 profile
 * 数据集（about / projects / publications / skills 等全部中英文本）都会被
 * 序列化进客户端 chunk，使英文页面的资源包里出现大量中文字符。
 */
interface NavbarProps {
  lang: Locale;
  /** 站点署名（已按 locale 解析为纯字符串） */
  name: string;
  hasAbout: boolean;
  hasHonors: boolean;
}

interface NavLink {
  href: string;
  label: string;
  /** 暂时隐藏的入口：保留配置，内容就绪后去掉 hidden 即可恢复 */
  hidden?: boolean;
}

/**
 * 导航链接按数据可用性动态生成。
 * 「荣誉」仅在存在荣誉/竞赛/证书时出现，
 * 「关于我」「联系我」仅在 about 数据公开时出现。
 * 「研究」入口已移除：研究内容整合进「项目经历」（方向标签筛选 + 学术成果/专利），
 * 原 /[lang]/research 由 next.config.ts 永久重定向到 /[lang]/projects。
 * 「博客」当前所有文章均为草稿（content/posts 全部 draft），暂时隐藏以避免空页面。
 */
function getNavLinks(
  locale: Locale,
  hasAbout: boolean,
  hasHonors: boolean
): NavLink[] {
  const zh = locale === "zh";
  return [
    { href: "", label: zh ? "首页" : "Home" },
    ...(hasAbout ? [{ href: "/about", label: zh ? "关于我" : "About" }] : []),
    { href: "/projects", label: zh ? "项目经历" : "Projects" },
    ...(hasHonors ? [{ href: "/honors", label: zh ? "荣誉资质" : "Honors" }] : []),
    { href: "/resume", label: zh ? "在线简历" : "Resume" },
    { href: "/blog", label: zh ? "博客" : "Blog", hidden: true },
    ...(hasAbout ? [{ href: "/contact", label: zh ? "联系我" : "Contact" }] : []),
  ];
}

/** 判断某个导航项是否为当前页面 */
function isActiveLink(pathname: string, locale: Locale, href: string): boolean {
  const base = `/${locale}`;
  if (href === "") return pathname === base || pathname === `${base}/`;
  return pathname === `${base}${href}` || pathname.startsWith(`${base}${href}/`);
}

export default function Navbar({
  lang,
  name,
  hasAbout,
  hasHonors,
}: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = getNavLinks(lang, hasAbout, hasHonors).filter(
    (link) => !link.hidden
  );

  const opposite = getOppositeLocale(lang);
  const oppositePath = pathname.match(/^\/(zh|en)(?=\/|$)/)
    ? pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${opposite}`)
    : `/${opposite}`;
  const menuId = "primary-mobile-navigation";

  // 移动端菜单展开时切到桌面宽度，需要重置状态，否则 aria-expanded 会残留 true
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // 主题图标不参与服务端/客户端的分支判断：
  // 服务端解析不出 resolvedTheme（恒为 undefined），若按它切换图标，
  // 服务端会输出月亮、客户端水合后输出太阳，导致全站每页的 Hydration Mismatch。
  // 因此两个图标都常驻 DOM，由既有 dark 变体用纯 CSS 决定显示哪一个，
  // 服务端与客户端输出因此完全一致；resolvedTheme 只用于点击时的目标主题计算。

  return (
    <nav
      aria-label={lang === "zh" ? "主导航" : "Primary navigation"}
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--background)", borderColor: "var(--card-border)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="min-w-0 shrink truncate text-base font-bold tracking-tight transition-opacity hover:opacity-80"
          style={{ color: "var(--foreground)" }}
        >
          {name}
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, lang, link.href);
            return (
              <Link
                key={link.href}
                href={`/${lang}${link.href}`}
                aria-current={active ? "page" : undefined}
                className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-[var(--card)]"
                style={{
                  color: active ? "var(--accent)" : "var(--muted)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Language switcher */}
          <Link
            href={oppositePath}
            className="rounded border px-2 py-1 text-xs transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)", borderColor: "var(--card-border)" }}
            aria-label={
              lang === "zh"
                ? "切换到英文并保留当前页面"
                : "Switch to Chinese and keep the current page"
            }
          >
            {localeSwitchLabels[lang]}
          </Link>

          {/* Theme toggle：点击时按当前已解析主题切换；图标由 dark 变体纯 CSS 决定 */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-md p-1.5 transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)" }}
            aria-label={lang === "zh" ? "切换深色或浅色主题" : "Toggle dark or light theme"}
            title={lang === "zh" ? "切换主题" : "Toggle theme"}
          >
            <Moon size={16} aria-hidden="true" className="dark:hidden" />
            <Sun size={16} aria-hidden="true" className="hidden dark:block" />
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-md p-1.5 transition-colors hover:bg-[var(--card)] lg:hidden"
            style={{ color: "var(--muted)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={lang === "zh" ? "切换导航菜单" : "Toggle navigation menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            title={lang === "zh" ? "导航菜单" : "Navigation menu"}
          >
            {menuOpen ? (
              <X size={16} aria-hidden="true" />
            ) : (
              <Menu size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id={menuId}
          className="flex flex-col gap-1 border-t px-3 py-2 lg:hidden"
          style={{ borderColor: "var(--card-border)" }}
        >
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, lang, link.href);
            return (
              <Link
                key={link.href}
                href={`/${lang}${link.href}`}
                aria-current={active ? "page" : undefined}
                className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--card)]"
                style={{
                  color: active ? "var(--accent)" : "var(--muted)",
                  fontWeight: active ? 600 : 400,
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
