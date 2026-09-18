import type { Locale } from "@/src/lib/i18n";
import { publicSkills } from "@/src/data/profile";

/**
 * 技能栈板块（可复用）。
 *
 * variant="compact" —— 首页预览：仅「分类标题 + 标签云」，不渲染分类说明与分组小标题。
 * variant="full"    —— 内页/简历：保留分类说明与分组小标题，信息完整。
 *
 * 两种模式都读取同一份 publicSkills，展示差异只由 variant 控制。
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
              ? "按算法与框架、硬件与嵌入式、工程与部署、工具与其他四大类展示，每一项都对应实际项目实践。"
              : "Grouped into four areas — algorithms and frameworks, hardware and embedded, engineering and deployment, and tools — each backed by hands-on project work."}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {publicSkills.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
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

            {/* 有 groups 时按分组渲染；compact 模式隐藏分组小标题，只留标签云 */}
            {category.groups && category.groups.length > 0 ? (
              <div className={showNotes ? "mt-4 space-y-4" : "mt-4 space-y-3"}>
                {category.groups.map((group) => (
                  <div key={group.id}>
                    {showNotes && (
                      <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                        {group.label[locale]}
                      </p>
                    )}
                    <ul className={showNotes ? "mt-2 flex flex-wrap gap-2" : "flex flex-wrap gap-2"}>
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
              <ul className="mt-4 flex flex-wrap gap-2">
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
