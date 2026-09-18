"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { getOppositeLocale, localeLabels } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";
import {
  publicAbout,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicIdentity,
  publicPatents,
  publicResearchAreas,
} from "@/src/data/profile";

interface NavbarProps {
  lang: Locale;
}

interface NavLink {
  href: string;
  label: string;
  /** 暂时隐藏的入口：保留配置，内容就绪后去掉 hidden 即可恢复 */
  hidden?: boolean;
}

/**
 * 导航链接按数据可用性动态生成：
 * 「研究」仅在存在公开研究方向或专利时出现，「荣誉」仅在存在荣誉/竞赛/证书时出现，
 * 「关于我」「联系我」仅在 about 数据公开时出现。
 * 「博客」当前所有文章均为草稿（content/posts 全部 draft），暂时隐藏以避免空页面。
 */
function getNavLinks(
  locale: Locale,
  hasResearch: boolean,
  hasAbout: boolean,
  hasHonors: boolean
): NavLink[] {
  const zh = locale === "zh";
  return [
    { href: "", label: zh ? "首页" : "Home" },
    ...(hasAbout ? [{ href: "/about", label: zh ? "关于我" : "About" }] : []),
    { href: "/projects", label: zh ? "项目经历" : "Projects" },
    ...(hasResearch ? [{ href: "/research", label: zh ? "研究" : "Research" }] : []),
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

export default function Navbar({ lang }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = getNavLinks(
    lang,
    publicResearchAreas.length > 0 || publicPatents.length > 0,
    publicAbout !== null,
    publicAwards.length > 0 ||
      publicCompetitions.length > 0 ||
      publicCredentials.length > 0
  ).filter((link) => !link.hidden);

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

  // 主题解析前 resolvedTheme 为 undefined，此时默认展示月亮图标
  const isDark = resolvedTheme === "dark";

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
          {publicIdentity?.name[lang] ?? (lang === "zh" ? "作品集" : "Portfolio")}
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
            {localeLabels[opposite]}
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-md p-1.5 transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)" }}
            aria-label={lang === "zh" ? "切换深色或浅色主题" : "Toggle dark or light theme"}
            title={lang === "zh" ? "切换主题" : "Toggle theme"}
          >
            {isDark ? (
              <Sun size={16} aria-hidden="true" />
            ) : (
              <Moon size={16} aria-hidden="true" />
            )}
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
