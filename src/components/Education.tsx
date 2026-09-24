import type { Locale } from "@/src/lib/i18n";
import { publicEducation } from "@/src/data/profile";

/**
 * 教育经历板块。
 * 首页与「关于我」页共用同一份实现与样式，避免两处各写一遍卡片。
 * 数据来自 public + verified 集合，为空时不渲染。
 */
export default function Education({ locale }: { locale: Locale }) {
  if (publicEducation.length === 0) return null;

  return (
    <section aria-labelledby="education-heading">
      <h2
        id="education-heading"
        className="text-2xl font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {locale === "zh" ? "教育经历" : "Education"}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {publicEducation.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                {entry.institution[locale]}
              </h3>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {entry.startDate} – {entry.endDate}
              </span>
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--foreground)" }}>
              {entry.degree[locale]} · {entry.major[locale]}
              {/* GPA 与专业排名：同字号、次级色，与专业信息自然衔接 */}
              {entry.gpa ? (
                <span style={{ color: "var(--muted)" }}>{` · GPA ${entry.gpa[locale]}`}</span>
              ) : null}
            </p>
            {entry.highlights.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight.en}
                    className="flex items-start gap-2 text-xs leading-5"
                    style={{ color: "var(--muted)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    {highlight[locale]}
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
