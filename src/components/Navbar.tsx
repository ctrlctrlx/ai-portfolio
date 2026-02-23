"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { getOppositeLocale, localeLabels } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";

interface NavbarProps {
  lang: Locale;
}

const navLinks = {
  zh: [
    { href: "", label: "首页" },
    { href: "/projects", label: "项目" },
    { href: "/blog", label: "博客" },
  ],
  en: [
    { href: "", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ],
};

export default function Navbar({ lang }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const opposite = getOppositeLocale(lang);

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--background)", borderColor: "var(--card-border)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="font-bold text-base tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: "var(--foreground)" }}
        >
          {lang === "zh" ? "杨明远" : "Mingyuan Yang"}
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
            href={`/${opposite}`}
            className="text-xs px-2 py-1 rounded border transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)", borderColor: "var(--card-border)" }}
          >
            {localeLabels[opposite]}
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md transition-colors hover:bg-[var(--card)]"
              style={{ color: "var(--muted)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-1.5 rounded-md transition-colors hover:bg-[var(--card)]"
            style={{ color: "var(--muted)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t px-4 py-2 flex flex-col gap-1" style={{ borderColor: "var(--card-border)" }}>
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
