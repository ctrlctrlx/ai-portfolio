export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

/** Type-safe locale validator */
export function isValidLocale(locale: string): locale is "zh" | "en" {
  return (locales as readonly string[]).includes(locale);
}

/** Returns the opposing locale for toggle links */
export function getOppositeLocale(locale: "zh" | "en"): "zh" | "en" {
  return locale === "zh" ? "en" : "zh";
}

/** Locale display labels */
export const localeLabels: Record<"zh" | "en", string> = {
  zh: "中文",
  en: "EN",
};

/**
 * 语言切换按钮的可见文案，按「当前页面语言」取值。
 *
 * 中文页面维持原有的 "EN" 不变；英文页面不再显示目标语言的中文字面「中文」，
 * 改为 "Chinese"，避免英文页面出现任何中文字符。
 */
export const localeSwitchLabels: Record<"zh" | "en", string> = {
  zh: "EN",
  en: "Chinese",
};
