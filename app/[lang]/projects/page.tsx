import { getSortedPublicProjects, publicIdentity } from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { Github, ExternalLink, ChevronDown, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
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
      ? `查看${publicIdentity?.name.zh ?? "候选人"}公开项目的 STAR 叙述、技术栈与面试重点。`
      : `Explore ${publicIdentity?.name.en ?? "the candidate"}'s public projects, STAR narratives, technology stacks, and interview focus points.`;
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
  const projects = getSortedPublicProjects();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          {locale === "zh" ? "项目经历" : "Projects"}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {locale === "zh"
            ? "所有项目均采用 STAR 结构叙述，并附有面试重点解析"
            : "All projects follow the STAR framework, with interview focus analysis"}
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
                    {proj.startDate} – {proj.endDate}
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
              <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
                {proj.subtitle[locale]}
              </p>

              {/* 核心量化数据：主题色加粗高亮 */}
              {proj.metrics.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                  {proj.metrics.map((metric) => (
                    <li
                      key={metric.zh}
                      className="flex items-center gap-2 text-sm font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                      {metric[locale]}
                    </li>
                  ))}
                </ul>
              )}

              {/* 核心亮点 */}
              {proj.highlights.length > 0 && (
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                  {proj.highlights.map((highlight) => (
                    <li
                      key={highlight.zh}
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

              {/* Links */}
              <div className="mt-3 flex flex-wrap gap-3">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 hover:underline"
                    style={{ color: "var(--muted)" }}
                  >
                    <Github size={12} /> GitHub
                  </a>
                )}
                {proj.isInteractive && proj.liveDemoUrl && (
                  <a
                    href={proj.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    <ExternalLink size={12} />
                    {locale === "zh" ? "在线演示" : "Live Demo"}
                  </a>
                )}
                <Link
                  href={`/${locale}/projects/${proj.slug}`}
                  className="ml-auto text-xs flex items-center gap-1 hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  <BookOpen size={12} />
                  {locale === "zh" ? "查看详情" : "View details"}
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
                  <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {proj[key][locale]}
                  </p>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {proj.metrics.map((m, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ background: "var(--tag-bg)", color: "var(--tag-text)", borderColor: "var(--tag-border)" }}
                >
                  {m[locale]}
                </span>
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
                  key={tag}
                  className="rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--tag-text)",
                    borderColor: "var(--tag-border)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Interview Focus — collapsible via details/summary */}
            <details
              className="group/details border-t"
              style={{ borderColor: "var(--card-border)" }}
            >
              <summary
                className="px-6 py-3 flex items-center gap-2 cursor-pointer select-none text-sm font-medium list-none"
                style={{ color: "var(--muted)" }}
              >
                <ChevronDown
                  size={14}
                  className="transition-transform group-open/details:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
                {locale === "zh" ? "面试重点解析" : "Interview Focus Points"}
              </summary>
              <ul className="px-6 pb-5 space-y-2">
                {proj.interviewFocus.map((focus, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--foreground)" }}>
                    <span
                      className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    {focus[locale]}
                  </li>
                ))}
              </ul>
            </details>
          </article>
          ))}
        </div>
      )}
    </div>
  );
}
