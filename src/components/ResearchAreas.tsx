import Link from "next/link";
import { ArrowRight, Fish, Microscope, Radio, Tags } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import { getPublicProjectBySlug, publicResearchAreas } from "@/src/data/profile";

/**
 * 研究方向卡片网格（研究页与「关于我」页共用）。
 *
 * - 每个方向按 id 映射一个线性图标，未知 id 回退到通用图标，
 *   与 About 组件里 strengthIcons 的做法一致，数据层不引入展示字段。
 * - showRelatedProjects=true 时在卡片底部展开关联公开项目链接（研究页使用）。
 * - columns 控制网格列数：2 列用于研究页（保持原有布局），3 列用于紧凑预览。
 */
const researchAreaIcons: Record<string, React.ElementType> = {
  "fish-open-set": Fish,
  "rfid-multiview-acquisition": Radio,
  "aquaculture-marking-standardization": Tags,
};

export default function ResearchAreas({
  locale,
  showRelatedProjects = false,
  columns = 2,
}: {
  locale: Locale;
  showRelatedProjects?: boolean;
  columns?: 2 | 3;
}) {
  if (publicResearchAreas.length === 0) return null;

  const gridClass =
    columns === 3
      ? "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "mt-5 grid gap-4 md:grid-cols-2";

  return (
    <div className={gridClass}>
      {publicResearchAreas.map((area) => {
        const Icon = researchAreaIcons[area.id] ?? Microscope;
        const relatedProjects = showRelatedProjects
          ? area.relatedProjectSlugs
              .map(getPublicProjectBySlug)
              .filter((project) => project !== null)
          : [];

        return (
          <article
            key={area.id}
            className="rounded-2xl border p-6"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--tag-bg)" }}
              >
                <Icon size={16} style={{ color: "var(--accent)" }} aria-hidden="true" />
              </span>
              <h3
                className="text-base font-semibold leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                {area.title[locale]}
              </h3>
            </div>

            {relatedProjects.length > 0 && (
              <div
                className="mt-5 border-t pt-4"
                style={{ borderColor: "var(--card-border)" }}
              >
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {locale === "zh" ? "相关公开项目" : "Related public projects"}
                </p>
                <div className="mt-2 space-y-2">
                  {relatedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/${locale}/projects/${project.slug}`}
                      className="flex items-center justify-between gap-3 text-sm hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      <span>{project.title[locale]}</span>
                      <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
