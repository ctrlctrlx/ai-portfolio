import { getSortedProjects } from "@/src/data/resumeData";
import type { Locale } from "@/src/lib/i18n";
import { Github, ExternalLink, ChevronDown } from "lucide-react";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const projects = getSortedProjects();

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

      <div className="space-y-8">
        {projects.map((proj) => (
          <article
            key={proj.id}
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex items-center gap-2">
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
                <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                  {proj.startDate} – {proj.endDate}
                </span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {proj.subtitle[locale]}
              </p>

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
                    className="text-xs flex items-center gap-1 hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    <ExternalLink size={12} />
                    {locale === "zh" ? "在线演示" : "Live Demo"}
                  </a>
                )}
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

            {/* Tech Stack */}
            <div
              className="px-6 py-4 border-t flex flex-wrap gap-2"
              style={{ borderColor: "var(--card-border)" }}
            >
              <span className="text-xs font-medium mr-1" style={{ color: "var(--muted)" }}>
                {locale === "zh" ? "技术栈：" : "Stack:"}
              </span>
              {proj.coreSkill.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded border"
                  style={{ color: "var(--muted)", borderColor: "var(--card-border)" }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Interview Focus — collapsible via details/summary */}
            <details
              className="border-t"
              style={{ borderColor: "var(--card-border)" }}
            >
              <summary
                className="px-6 py-3 flex items-center gap-2 cursor-pointer select-none text-sm font-medium list-none"
                style={{ color: "var(--muted)" }}
              >
                <ChevronDown size={14} className="transition-transform details-open:rotate-180" />
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
    </div>
  );
}
