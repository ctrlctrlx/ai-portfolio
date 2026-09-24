import type { CSSProperties, ReactNode } from "react";

/**
 * 轻量富文本渲染：支持空行分段与 **重点** 加粗。
 *
 * 背景：项目「结果」等长叙述需要段落层级与关键量化指标突出，但数据层坚持
 * 纯字符串（BilingualText），不引入富文本结构。因此约定 **…** 为加粗标记，
 * 渲染时复用全站既有的 font-semibold 与继承文字色，不新增任何颜色或字号。
 *
 * 问答层（career-agent）会剥离该标记后按纯文本输出，保证聊天界面不出现 **。
 */
export default function RichText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <div className={className} style={style}>
      {paragraphs.map((paragraph, index) => (
        // 首段与父容器对齐，其余段落之间保持既有行距节奏（mt-2）
        <p key={paragraph} className={index === 0 ? undefined : "mt-2"}>
          {renderEmphasis(paragraph)}
        </p>
      ))}
    </div>
  );
}

/**
 * 取多段叙述的首段：列表卡片只展示工程化概述，保证卡片高度与既有版式接近；
 * 完整四段式叙述在项目详情页展开。
 */
export function firstParagraph(text: string): string {
  const [lead] = text.split(/\n{2,}/);
  return (lead ?? text).trim();
}

/** 剥离 ** 加粗标记，得到纯文本（打印简历等不解析富文本的场景使用） */
export function toPlainText(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

/** 按 ** 标记切分：奇数段为加粗内容，其余为普通文本 */
function renderEmphasis(paragraph: string): ReactNode[] {
  return paragraph
    .split(/\*\*(.+?)\*\*/g)
    .map((segment, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-semibold">
          {segment}
        </strong>
      ) : (
        segment
      )
    );
}
