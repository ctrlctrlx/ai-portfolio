import type { Locale } from "@/src/lib/i18n";
import { lastUpdated } from "@/src/data/site/lastUpdated";

export interface FooterNavLink {
  href: string;
  label: Record<Locale, string>;
}

export interface FooterExtraContact {
  id: string;
  /** 已按当前 locale 解析为纯字符串 */
  label: string;
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
  /** 邮箱条目前缀（值与链接在服务端布局解析后作为 prop 传入） */
  emailLabel: string;
  /** 电话条目前缀（值与链接在服务端布局解析后作为 prop 传入） */
  phoneLabel: string;
  /** 访客计数文案 */
  visitors: (count: string) => string;
  /** 邮箱链接的无障碍标签 */
  emailAriaLabel: (email: string) => string;
  /** 站内导航链接 */
  navLinks: FooterNavLink[];
  /** 邮箱之外的公开联系方式（微信等），由服务端布局从 about.contacts 解析后传入 */
  extraContacts: FooterExtraContact[];
}

/**
 * 页脚所需的 profile 派生信息，由服务端布局解析后传入。
 *
 * 本模块不再 import "@/src/data/profile"：它被客户端组件 Footer 引用，
 * 一旦在客户端模块图里引入 profile 数据层，整个双语数据集都会被序列化进
 * 客户端 chunk，使英文页面的资源包里出现大量中文字符。
 */
export interface FooterProfileSummary {
  /** 版权行署名（固定使用英文姓名） */
  name: string;
  /** 是否存在荣誉/竞赛/证书板块 */
  hasHonors: boolean;
  extraContacts: FooterExtraContact[];
}

/** 站内导航：与顶部导航保持同一组入口（研究入口已并入「项目经历」） */
function buildNavLinks(hasHonors: boolean): FooterNavLink[] {
  const links: FooterNavLink[] = [
    { href: "/about", label: { zh: "关于我", en: "About" } },
    { href: "/projects", label: { zh: "项目经历", en: "Projects" } },
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

export function getFooterDictionary(
  locale: Locale,
  summary: FooterProfileSummary
): FooterDictionary {
  const isZh = locale === "zh";

  return {
    copyright: `© ${new Date().getFullYear()} ${summary.name}. All rights reserved.`,
    disclaimer: isZh
      ? "本网站仅用于个人求职展示，所有项目资料未经许可禁止转载、商用。"
      : "This site is for personal job-seeking presentation only. All project materials may not be reproduced or used commercially without permission.",
    lastUpdatedLabel: isZh ? "最后更新" : "Last updated",
    lastUpdatedValue: formatLastUpdated(lastUpdated.iso, locale),
    navHeading: isZh ? "站内导航" : "Site navigation",
    contactHeading: isZh ? "联系方式" : "Contact",
    emailLabel: isZh ? "邮箱" : "Email",
    phoneLabel: isZh ? "电话" : "Phone",
    visitors: (count) =>
      isZh ? `全球访客 ${count} 人次` : `${count} global visitors`,
    emailAriaLabel: (email) =>
      isZh
        ? `发送邮件至公开求职邮箱 ${email}`
        : `Email the public contact address ${email}`,
    navLinks: buildNavLinks(summary.hasHonors),
    extraContacts: summary.extraContacts,
  };
}
