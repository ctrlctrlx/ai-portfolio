import { Download } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";

/**
 * 正式简历 PDF 下载入口。
 * 指向 public/resume.pdf（本地上传的正式版简历），不使用浏览器打印生成。
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

  const className =
    variant === "primary"
      ? "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
      : "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]";

  const style =
    variant === "primary"
      ? { background: "var(--accent)", color: "var(--accent-foreground)" }
      : { borderColor: "var(--card-border)", color: "var(--foreground)" };

  return (
    <a
      href="/resume.pdf"
      download
      className={className}
      style={style}
      aria-label={
        locale === "zh"
          ? `${text}（下载正式版简历文件）`
          : `${text} (downloads the formal resume file)`
      }
    >
      <Download size={15} aria-hidden="true" />
      {text}
    </a>
  );
}
