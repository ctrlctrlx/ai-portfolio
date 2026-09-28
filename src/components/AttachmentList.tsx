import { Download } from "lucide-react";
import ImageGallery from "@/src/components/ImageGallery";
import type { Locale } from "@/src/lib/i18n";
import type { Attachment } from "@/src/data/profile";

/**
 * 荣誉资质附件入口（奖项 / 竞赛 / 证书 / 专利四类条目共用）。
 *
 * 采用**行内文字链**样式，与条目颁发机构行同行右对齐，压缩页面纵向空间：
 * - 图片类附件：显示「查看证明 / View Proof」，点击复用 `ImageGallery` 的灯箱
 *   （全屏预览、键盘 ←/→ 切换、Esc 关闭、焦点管理完全一致），不渲染缩略图；
 * - 文件类附件：显示「下载证书 / Download Certificate」，原生 `<a download>` 直接下载；
 * - 两个文字链统一使用品牌蓝（`--accent`，与主按钮/主链接同色，浅深色主题自动适配），
 *   hover 时下划线 + 加深一级（`--accent-hover`）；文案与无障碍名称均按 locale 输出；
 * - 无附件时返回 `null`，不渲染任何元素。
 */
export default function AttachmentList({
  attachments,
  locale,
}: {
  attachments?: Attachment[];
  locale: Locale;
}) {
  if (!attachments || attachments.length === 0) return null;

  const imageAttachments = attachments.filter(
    (attachment) => attachment.type === "image"
  );
  const fileAttachments = attachments.filter(
    (attachment) => attachment.type === "file"
  );

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {imageAttachments.length > 0 && (
        <ImageGallery
          variant="link"
          locale={locale}
          linkLabel={locale === "zh" ? "查看证明" : "View Proof"}
          lightboxLabel={
            locale === "zh" ? "证明材料预览" : "Supporting file preview"
          }
          images={imageAttachments.map((attachment) => ({
            id: attachment.path,
            src: attachment.path,
            caption: locale === "zh" ? attachment.name : attachment.nameEn,
            alt: locale === "zh" ? attachment.name : attachment.nameEn,
          }))}
        />
      )}

      {fileAttachments.map((attachment) => (
        <a
          key={attachment.path}
          href={attachment.path}
          /* 附件文件名为 ASCII 规范命名，取路径末段作为另存文件名 */
          download={attachment.path.split("/").pop()}
          className="inline-flex items-center gap-1 text-xs hover:text-[var(--accent-hover)] hover:underline"
          style={{ color: "var(--accent)" }}
          aria-label={
            locale === "zh"
              ? `下载证书：${attachment.name}（${attachment.format}）`
              : `Download certificate: ${attachment.nameEn} (${attachment.formatEn})`
          }
        >
          <Download size={12} aria-hidden="true" />
          {locale === "zh" ? "下载证书" : "Download Certificate"}
        </a>
      ))}
    </span>
  );
}
