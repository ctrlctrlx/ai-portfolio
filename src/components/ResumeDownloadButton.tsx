import { Download } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";

/**
 * 正式简历 PDF 下载入口。
 *
 * 双语各一份，均由 `/[lang]/resume` 页面（同一份 profile 数据源）打印生成，
 * 不使用浏览器打印按钮即时生成：
 * - 中文页 → `public/resume.pdf`
 * - 英文页 → `public/resume-en.pdf`
 *
 * variant="primary" 用于在线简历页顶部的醒目主按钮，默认样式用于首屏按钮区。
 */
export default function ResumeDownloadButton({
  locale,
  variant = "default",
  label,
}: {
  locale: Locale;
  variant?: "default" | "primary";
  label?: string;
}) {
  const text =
    label ??
    (locale === "zh" ? "下载简历 PDF" : "Download Resume PDF");

  /**
   * 浏览器另存为时的文件名按当前语言取值；
   * 与 href 指向的正式版文件保持语言一致。
   */
  const isEnglish = locale === "en";
  const downloadFileName = isEnglish
    ? "Yang Chong Resume.pdf"
    : "杨冲-个人简历.pdf";

  const className =
    variant === "primary"
      ? "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
      : "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]";

  const style =
    variant === "primary"
      ? { background: "var(--accent)", color: "var(--accent-foreground)" }
      : { borderColor: "var(--card-border)", color: "var(--foreground)" };

  const ariaLabel = isEnglish
    ? `${text} (downloads the formal resume file)`
    : `${text}（下载正式版简历文件）`;

  return (
    <a
      href={isEnglish ? "/resume-en.pdf" : "/resume.pdf"}
      download={downloadFileName}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      <Download size={15} aria-hidden="true" />
      {text}
    </a>
  );
}
