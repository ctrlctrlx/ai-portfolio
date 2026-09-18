import type { Locale } from "@/src/lib/i18n";
import { lastUpdated } from "@/src/data/site/lastUpdated";
import {
  publicAbout,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicIdentity,
} from "@/src/data/profile";

export interface FooterNavLink {
  href: string;
  label: Record<Locale, string>;
}

export interface FooterExtraContact {
  id: string;
  label: Record<Locale, string>;
  value: string;
}

export interface FooterDictionary {
  /** 版权行 */
  copyright: string;
  /** 免责声明 */
  disclaimer: string;
  /** 「最后更新」前缀；无时间数据时为 null */
  lastUpdatedLabel: string | null;
  /** 已格式化的最后更新日期；无数据时为 null */
  lastUpdatedValue: string | null;
  /** 站内导航小标题 */
  navHeading: string;
  /** 联系方式小标题 */
  contactHeading: string;
  /** 访客计数文案 */
  visitors: (count: string) => string;
  /** 邮箱链接的无障碍标签 */
  emailAriaLabel: (email: string) => string;
  /** 站内导航链接 */
  navLinks: FooterNavLink[];
  /** 邮箱之外的公开联系方式（微信等），来自 about.contacts */
  extraContacts: FooterExtraContact[];
}

/** 站内导航：与顶部导航保持同一组入口 */
function buildNavLinks(hasHonors: boolean): FooterNavLink[] {
  const links: FooterNavLink[] = [
    { href: "/about", label: { zh: "关于我", en: "About" } },
    { href: "/projects", label: { zh: "项目经历", en: "Projects" } },
    { href: "/research", label: { zh: "研究", en: "Research" } },
  ];
  if (hasHonors) {
    links.push({ href: "/honors", label: { zh: "荣誉资质", en: "Honors" } });
  }
  links.push(
    { href: "/resume", label: { zh: "在线简历", en: "Resume" } },
    { href: "/contact", label: { zh: "联系我", en: "Contact" } }
  );
  return links;
}

/** 数值部分加粗，方便读取 */
export function formatLastUpdated(
  iso: string | null,
  locale: Locale
): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(date);
}

export function getFooterDictionary(locale: Locale): FooterDictionary {
  const isZh = locale === "zh";
  const name = publicIdentity?.name.en ?? "Yang Chong";
  const hasHonors =
    publicAwards.length > 0 ||
    publicCompetitions.length > 0 ||
    publicCredentials.length > 0;

  return {
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    disclaimer: isZh
      ? "本网站仅用于个人求职展示，所有项目资料未经许可禁止转载、商用。"
      : "This site is for personal job-seeking presentation only. All project materials may not be reproduced or used commercially without permission.",
    lastUpdatedLabel: isZh ? "最后更新" : "Last updated",
    lastUpdatedValue: formatLastUpdated(lastUpdated.iso, locale),
    navHeading: isZh ? "站内导航" : "Site navigation",
    contactHeading: isZh ? "联系方式" : "Contact",
    visitors: (count) =>
      isZh ? `全球访客 ${count} 人次` : `${count} global visitors`,
    emailAriaLabel: (email) =>
      isZh
        ? `发送邮件至公开求职邮箱 ${email}`
        : `Email the public contact address ${email}`,
    navLinks: buildNavLinks(hasHonors),
    extraContacts:
      publicAbout?.contacts.map((contact) => ({
        id: contact.id,
        label: { zh: contact.label.zh, en: contact.label.en },
        value: contact.value[locale],
      })) ?? [],
  };
}
