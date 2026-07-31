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
