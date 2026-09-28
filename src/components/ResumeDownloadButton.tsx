"use client";

import { Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import type { Locale } from "@/src/lib/i18n";

/**
 * 简历下载入口所在页面：用于自定义事件 `resume_download` 的 page 参数，
 * 区分不同入口的转化效果。全站四处入口（首页 / 关于我 / 联系我 / 在线简历）
 * 共用本组件，页面归属由当前路径推导，调用方无需传参。
 */
function getDownloadPage(pathname: string): "home" | "about" | "resume" | "contact" | "other" {
  const segment = pathname.split("/").filter(Boolean)[1];
  if (!segment) return "home";
  if (segment === "about" || segment === "resume" || segment === "contact") {
    return segment;
  }
  return "other";
}

/**
 * 正式简历 PDF 下载入口。
 *
 * 全站唯一的官方简历文件是本人提供的 `public/杨冲个人简历.pdf`（中文正式版），
 * 中英文页面都指向同一份文件，仅「另存为」的文件名按当前语言取值；
 * 不再自动生成 PDF，也不再存在第二份英文 PDF。
 *
 * href 使用百分号编码（等价于 `/杨冲个人简历.pdf`）：文件名保持中文原文，
 * 同时英文页面的 HTML 里不出现任何中文字符（避免英文页出现中文残留）。
 *
 * 统计：点击时触发 Vercel Analytics 自定义事件 `resume_download`，携带
 * `language`（zh / en）与 `page`（home / about / resume / contact）。
 * `track()` 只把事件推进内存队列（非阻塞、不 preventDefault），
 * 因此不影响下载行为与文件名规则；前端也不渲染任何统计元素。
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
  const pathname = usePathname();

  const text =
    label ??
    (locale === "zh" ? "下载简历 PDF" : "Download Resume PDF");

  /** 浏览器另存为时的文件名按当前语言取值；文件本身为同一份中文正式版简历 */
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
      href="/%E6%9D%A8%E5%86%B2%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86.pdf"
      download={downloadFileName}
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={() => {
        // 自定义事件：语言 + 入口页面。异步非阻塞，不影响默认下载行为。
        track("resume_download", { language: locale, page: getDownloadPage(pathname) });
      }}
    >
      <Download size={15} aria-hidden="true" />
      {text}
    </a>
  );
}
