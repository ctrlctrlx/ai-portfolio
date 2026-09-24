import { Download, FileText } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import type { ProjectDocument } from "@/src/data/profile";

/**
 * 「相关文档下载」板块。
 *
 * - 每个文档一个下载按钮，左侧文档图标，右侧标注格式与「PDF 下载」字样。
 * - 点击在新标签页打开 / 下载（download 属性），不跳转站内其他页面。
 * - 文档路径由 src/data/profile/projectMedia.ts 提供，统一放在 public/docs/。
 * - 样式沿用全站主题令牌与现有按钮一致，适配深色/浅色主题。
 */
export default function ProjectDocuments({
  documents,
  locale,
}: {
  documents: ProjectDocument[];
  locale: Locale;
}) {
  if (documents.length === 0) return null;

  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
      {documents.map((document) => (
        <li key={document.id}>
          <a
            href={document.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="group flex h-full items-start gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
            aria-label={
              locale === "zh"
                ? `下载 ${document.title.zh}（PDF，新窗口打开）`
                : `Download ${document.title.en} (PDF, opens in a new tab)`
            }
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "var(--tag-bg)" }}
            >
              <FileText size={18} style={{ color: "var(--accent)" }} aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <span
                className="block text-sm font-medium leading-6"
                style={{ color: "var(--foreground)" }}
              >
                {document.title[locale]}
              </span>
              <span className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
                >
                  {document.tag[locale]}
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  <Download size={12} aria-hidden="true" />
                  {locale === "zh" ? "PDF 下载" : "PDF download"}
                </span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
