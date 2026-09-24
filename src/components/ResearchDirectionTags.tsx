import type { Locale } from "@/src/lib/i18n";
import { publicAbout } from "@/src/data/profile";

/**
 * 通用研究方向标签组（目前仅首页首屏使用）。
 *
 * 项目经历页的方向筛选模块已按需求移除，因此本组件只做纯展示：
 * 不再包含筛选链接、选中态与点击交互。
 * 数据仍来自 about.researchDirections，与个人简介、机器人回答同源。
 */
export default function ResearchDirectionTags({ locale }: { locale: Locale }) {
  const directions = publicAbout?.researchDirections ?? [];
  if (directions.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {directions.map((direction) => (
        <li key={direction.id}>
          <span
            className="rounded-full border px-2.5 py-1 text-xs"
            style={{
              background: "var(--tag-bg)",
              color: "var(--tag-text)",
              borderColor: "var(--tag-border)",
            }}
          >
            {direction.label[locale]}
          </span>
        </li>
      ))}
    </ul>
  );
}
