import type { Locale } from "@/src/lib/i18n";
import { publicSkills } from "@/src/data/profile";

/**
 * 技能栈板块（可复用）。
 *
 * variant="compact" —— 首页预览：分类标题 + 分组小标题 + 标签云，不渲染分类说明。
 * variant="full"    —— 内页/简历：额外渲染分类说明，信息完整。
 *
 * 两种模式都读取同一份 publicSkills，分组层级一致，展示差异只由 variant 控制。
 */
export default function Skills({
  locale,
  variant = "full",
}: {
  locale: Locale;
  variant?: "compact" | "full";
}) {
  if (publicSkills.length === 0) return null;

  const showNotes = variant === "full";
  /**
   * 首页（compact）在 lg 及以上三列等宽并排，平板两列、手机单列；
   * 分组标题与标签云的行距同步收紧，卡片内边距由 p-5 降至 p-3.75（-25%），
   * 消除三列后卡片内的大面积空白。
   */
  const gridClass =
    variant === "compact"
      ? "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      : "mt-6 grid gap-4 lg:grid-cols-2";

  return (
    <section aria-labelledby="skills-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          {locale === "zh" ? "能力证据" : "Capability Evidence"}
        </p>
        <h2
          id="skills-heading"
          className="mt-2 text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "技能栈" : "Skills"}
        </h2>
        {showNotes && (
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
            {locale === "zh"
              ? "按编程语言、框架与工具、研究方向三类分组展示，每一项都对应实际项目实践。"
              : "Grouped into three areas — programming languages, frameworks and tools, and research directions — each backed by hands-on project work."}
          </p>
        )}
      </div>

      <div className={gridClass}>
        {publicSkills.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border p-3.75 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
              {category.label[locale]}
            </h3>
            {showNotes && category.note && (
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                {category.note[locale]}
              </p>
            )}

            {/* 分组展示：分类标题在上，分组小标题在每组标签云之上（两种 variant 均显示层级） */}
            {category.groups && category.groups.length > 0 ? (
              <div className="mt-3 space-y-3">
                {category.groups.map((group) => (
                  <div key={group.id}>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                      {group.label[locale]}
                    </p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li
                          key={`${group.id}-${item.id}`}
                          className="rounded-full border px-2.5 py-1 text-xs"
                          style={{
                            borderColor: "var(--tag-border)",
                            color: "var(--tag-text)",
                            background: "var(--tag-bg)",
                          }}
                        >
                          {item.name[locale]}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-full border px-2.5 py-1 text-xs"
                    style={{
                      borderColor: "var(--tag-border)",
                      color: "var(--tag-text)",
                      background: "var(--tag-bg)",
                    }}
                  >
                    {item.name[locale]}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
