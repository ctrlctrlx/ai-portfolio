import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import {
  getProjectBySlug,
  projects,
  type Project,
} from "@/src/data/profile";
import { identity } from "@/src/data/profile/identity";
import type { Locale } from "@/src/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return ["zh", "en"].flatMap((lang) =>
    projects.map((project) => ({ lang, slug: project.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: locale === "zh" ? "项目未找到" : "Project not found",
      description:
        locale === "zh"
          ? "请求的项目不存在或未公开展示。"
          : "The requested project does not exist or is not publicly available.",
    };
  }

  const title = `${project.title[locale]} | ${identity.name[locale]}`;
  const description = project.subtitle[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

const starFields: Array<{
  key: "situation" | "task" | "action" | "result";
  label: Record<Locale, string>;
}> = [
  { key: "situation", label: { zh: "背景", en: "Situation" } },
  { key: "task", label: { zh: "目标", en: "Task" } },
  { key: "action", label: { zh: "行动", en: "Action" } },
  { key: "result", label: { zh: "结果", en: "Result" } },
];

function ProjectLinks({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  if (!project.githubUrl && !(project.isInteractive && project.liveDemoUrl)) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm hover:underline"
          style={{ color: "var(--muted)" }}
          aria-label={`${project.title[locale]} GitHub`}
        >
          <Github size={14} />
          GitHub
        </a>
      )}
      {project.isInteractive && project.liveDemoUrl && (
        <a
          href={project.liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm hover:underline"
          style={{ color: "var(--accent)" }}
          aria-label={
            locale === "zh"
              ? `${project.title.zh}在线演示`
              : `${project.title.en} live demo`
          }
        >
          <ExternalLink size={14} />
          {locale === "zh" ? "在线演示" : "Live demo"}
        </a>
      )}
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href={`/${locale}/projects`}
        className="inline-flex items-center gap-1.5 text-sm mb-8 hover:underline"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} />
        {locale === "zh" ? "返回项目列表" : "Back to projects"}
      </Link>

      <header className="space-y-4">
        <div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {project.startDate} – {project.endDate}
          </p>
          <h1
            className="mt-2 text-2xl sm:text-3xl font-bold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {project.title[locale]}
          </h1>
        </div>
        <ProjectLinks project={project} locale={locale} />
      </header>

      <section className="mt-10">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "STAR 项目叙述" : "STAR project narrative"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {starFields.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-xl border p-5"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
              }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--accent)" }}
              >
                {label[locale]}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                {project[key][locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "核心技能与技术栈" : "Core skills and stack"}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.coreSkill.map((skill) => (
            <span
              key={skill}
              className="rounded-full border px-3 py-1 text-xs"
              style={{
                background: "var(--tag-bg)",
                color: "var(--tag-text)",
                borderColor: "var(--tag-border)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {project.interviewFocus.length > 0 && (
        <section className="mt-10">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "面试重点" : "Interview focus"}
          </h2>
          <ul className="mt-4 space-y-3">
            {project.interviewFocus.map((focus) => (
              <li
                key={focus.zh}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                {focus[locale]}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
