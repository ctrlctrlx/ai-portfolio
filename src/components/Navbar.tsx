"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { getOppositeLocale, localeLabels } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";
import { publicIdentity, publicResearchAreas } from "@/src/data/profile";

interface NavbarProps {
  lang: Locale;
}

function getNavLinks(hasResearch: boolean) {
  return {
  zh: [
    { href: "", label: "首页" },
    { href: "/projects", label: "项目" },
    ...(hasResearch ? [{ href: "/research", label: "研究" }] : []),
    { href: "/blog", label: "博客" },
  ],
  en: [
    { href: "", label: "Home" },
    { href: "/projects", label: "Projects" },
    ...(hasResearch ? [{ href: "/research", label: "Research" }] : []),
    { href: "/blog", label: "Blog" },
  ],
  };
}

export default function Navbar({ lang }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = getNavLinks(publicResearchAreas.length > 0);

  const opposite = getOppositeLocale(lang);
  const oppositePath = pathname.match(/^\/(zh|en)(?=\/|$)/)
    ? pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${opposite}`)
    : `/${opposite}`;
  const menuId = "primary-mobile-navigation";

  return (
    <nav
      aria-label={lang === "zh" ? "主导航" : "Primary navigation"}
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--background)", borderColor: "var(--card-border)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="font-bold text-base tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: "var(--foreground)" }}
        >
          {publicIdentity?.name[lang] ?? (lang === "zh" ? "作品集" : "Portfolio")}
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks[lang].map((link) => (
            <Link
              key={link.href}
              href={`/${lang}${link.href}`}
              className="px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-[var(--card)]"
              style={{ color: "var(--muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <Link
            href={oppositePath}
            className="text-xs px-2 py-1 rounded border transition-colors hover:bg-[var(--card)]"
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
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)" }}
            aria-label={lang === "zh" ? "切换深色或浅色主题" : "Toggle dark or light theme"}
            title={lang === "zh" ? "切换主题" : "Toggle theme"}
          >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
          </button>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-1.5 rounded-md transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={lang === "zh" ? "切换导航菜单" : "Toggle navigation menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            title={lang === "zh" ? "导航菜单" : "Navigation menu"}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id={menuId}
          className="sm:hidden border-t px-4 py-2 flex flex-col gap-1"
          style={{ borderColor: "var(--card-border)" }}
        >
          {navLinks[lang].map((link) => (
            <Link
              key={link.href}
              href={`/${lang}${link.href}`}
              className="px-3 py-2 rounded-md text-sm transition-colors hover:bg-[var(--card)]"
              style={{ color: "var(--muted)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
