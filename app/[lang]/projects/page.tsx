import { getSortedPublicProjects, publicIdentity } from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import AcademicOutput from "@/src/components/AcademicOutput";
import RichText, { firstParagraph } from "@/src/components/RichText";
import { getAbsolutePageUrl } from "@/src/lib/siteUrl";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title =
    locale === "zh"
      ? `项目经历 | ${publicIdentity?.name.zh ?? "作品集"}`
      : `Projects | ${publicIdentity?.name.en ?? "Portfolio"}`;
  const description =
    locale === "zh"
      ? `查看${publicIdentity?.name.zh ?? "候选人"}公开项目的 STAR 叙述、核心量化指标与技术栈。`
      : `Explore ${publicIdentity?.name.en ?? "the candidate"}'s public projects: STAR narratives, key metrics, and technology stacks.`;
  const pageUrl = getAbsolutePageUrl(`/${locale}/projects`);

  return {
    title,
    description,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      ...(pageUrl ? { url: pageUrl } : {}),
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;

  /**
   * 直接展示全部项目（按精选优先 + 开始时间倒序）。
   * 原「研究领域总览 / 方向标签筛选」模块已移除；项目数据层仍保留
   * researchDirections 字段，后续如需恢复筛选可直接复用，无需改数据。
   */
  const projects = getSortedPublicProjects();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* 顶部只保留页面大标题与一句说明，压缩与首个卡片之间的留白 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          {locale === "zh" ? "项目经历" : "Projects"}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {locale === "zh"
            ? "所有项目均采用 STAR 结构叙述，并前置核心量化指标"
            : "All projects follow the STAR framework, with key metrics surfaced up front"}
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {locale === "zh"
            ? "当前没有可公开展示的项目。"
            : "There are currently no public projects to display."}
        </p>
      ) : (
        <div className="space-y-8">
          {projects.map((proj) => (
          <article
            key={proj.id}
            className="group overflow-hidden rounded-xl border transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg motion-reduce:transition-none"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {proj.featured && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{ background: "var(--tag-bg)", color: "var(--tag-text)", borderColor: "var(--tag-border)" }}
                    >
                      {locale === "zh" ? "精选" : "Featured"}
                    </span>
                  )}
                  <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                    {proj.title[locale]}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                    {proj.startDate} – {proj.endDate[locale]}
                  </span>
                  {/* 项目角色徽章：固定在卡片右上角 */}
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: "var(--accent)",
                      color: "var(--accent-foreground)",
                    }}
                  >
                    {proj.role[locale]}
                  </span>
                </div>
              </div>
              {/* 核心量化指标前置：占据副标题位置，次级色、字号小于标题 */}
              {proj.metrics.length > 0 && (
                <p
                  className="mt-1.5 text-sm font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {proj.metrics.map((metric) => metric[locale]).join(" · ")}
                </p>
              )}
              {/* 原副标题概述保留在指标下方，不丢失项目一句话说明 */}
              <p
                className={proj.metrics.length > 0 ? "mt-1 text-sm" : "mt-1.5 text-sm"}
                style={{ color: "var(--muted)" }}
              >
                {proj.subtitle[locale]}
              </p>

              {/* 核心亮点 */}
              {proj.highlights.length > 0 && (
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                  {proj.highlights.map((highlight) => (
                    <li
                      key={highlight.en}
                      className="flex items-start gap-2 text-xs leading-5"
                      style={{ color: "var(--muted)" }}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--card-border)" }}
                      />
                      {highlight[locale]}
                    </li>
                  ))}
                </ul>
              )}

              {/* 操作区：仅保留「查看详情」入口（GitHub / 在线演示入口已按需求移除） */}
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/projects/${proj.slug}`}
                  className="ml-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-foreground)",
                  }}
                >
                  {locale === "zh" ? "查看详情" : "View details"}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* STAR */}
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {(
                [
                  { key: "situation", labelZh: "背景", labelEn: "Situation" },
                  { key: "task", labelZh: "目标", labelEn: "Task" },
                  { key: "action", labelZh: "行动", labelEn: "Action" },
                  { key: "result", labelZh: "结果", labelEn: "Result" },
                ] as const
              ).map(({ key, labelZh, labelEn }) => (
                <div key={key}>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {locale === "zh" ? labelZh : labelEn}
                  </p>
                  {/*
                    结果段落已升级为四段式工程化叙述，列表卡片只取首段概述，
                    保证卡片高度与既有版式一致；完整叙述在项目详情页展开。
                  */}
                  <RichText
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--foreground)" }}
                    text={
                      key === "result"
                        ? firstParagraph(proj[key][locale])
                        : proj[key][locale]
                    }
                  />
                </div>
              ))}
            </div>

            {/* Tech Tags */}
            <div
              className="px-6 py-4 border-t flex flex-wrap items-center gap-2"
              style={{ borderColor: "var(--card-border)" }}
            >
              <span className="mr-1 text-xs font-medium" style={{ color: "var(--muted)" }}>
                {locale === "zh" ? "技术标签：" : "Tech tags:"}
              </span>
              {proj.techTags.map((tag) => (
                <span
                  key={tag.en}
                  className="rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--tag-text)",
                    borderColor: "var(--tag-border)",
                  }}
                >
                  {tag[locale]}
                </span>
              ))}
            </div>

            {/* Interview Focus 折叠面板已按需求移除，卡片以量化指标 + 技术标签收尾 */}
          </article>
          ))}
        </div>
      )}

      {/* 学术成果与专利：原 /[lang]/research 的内容，随该路由重定向迁入本页 */}
      <AcademicOutput locale={locale} />
    </div>
  );
}
