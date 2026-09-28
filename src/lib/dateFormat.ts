import type { Locale } from "@/src/lib/i18n";

/** 英文月份缩写（带点），与 `Mon. YYYY` 格式约定一致 */
const EN_MONTHS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];

/**
 * 展示层统一时间格式。
 *
 * - 数据层唯一事实格式：`YYYY.MM`（按字典序即时间倒序），仅在数据层维护；
 * - 中文展示：原样 `YYYY.MM`；
 * - 英文展示：`Mon. YYYY`（例如 `2025.04` → `Apr. 2025`）；
 *
 * 无法识别为 `YYYY` / `YYYY.MM` 的字符串（例如「至今 / Present」）原样返回，
 * 避免把已是自然语言的字段二次加工。
 */
export function formatYearMonth(value: string, locale: Locale): string {
  const match = /^(\d{4})(?:\.(\d{2}))?$/.exec(value.trim());
  if (!match) return value;

  const [, year, month] = match;
  if (!month) return year;
  if (locale === "zh") return `${year}.${month}`;

  const monthIndex = Number(month) - 1;
  return EN_MONTHS[monthIndex] ? `${EN_MONTHS[monthIndex]} ${year}` : value;
}

/**
 * 展示层时间区间：两端分别按 locale 格式化，用 en dash 连接
 * （与全站既有「2024.09 – 2027.06」的写法一致）。
 */
export function formatDateRange(
  start: string,
  end: string,
  locale: Locale
): string {
  return `${formatYearMonth(start, locale)} – ${formatYearMonth(end, locale)}`;
}

/**
 * 把一段文本里所有 `YYYY.MM` 记号按 locale 本地化（中文保持原样）。
 * 用于数据层以双语字符串维护的时间描述（例如实践经历的 period：
 * 「2019.09 – 2022.12」→ 英文「Sep. 2019 – Dec. 2022」）。
 */
export function formatDateTokens(text: string, locale: Locale): string {
  if (locale === "zh") return text;
  return text.replace(/\d{4}\.\d{2}/g, (token) => formatYearMonth(token, locale));
}
