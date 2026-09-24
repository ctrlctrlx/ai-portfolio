import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProjectDocuments from "@/src/components/ProjectDocuments";
import ImageGallery from "@/src/components/ImageGallery";
import RichText from "@/src/components/RichText";
import {
  getPublicProjectBySlug,
  publicIdentity,
  publicProjects,
} from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { getAbsolutePageUrl } from "@/src/lib/siteUrl";

export const dynamicParams = false;

export function generateStaticParams() {
  return ["zh", "en"].flatMap((lang) =>
    publicProjects.map((project) => ({ lang, slug: project.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    return {
      title: locale === "zh" ? "项目未找到" : "Project not found",
      description:
        locale === "zh"
          ? "请求的项目不存在或未公开展示。"
          : "The requested project does not exist or is not publicly available.",
    };
  }

  const title = `${project.title[locale]} | ${publicIdentity?.name[locale] ?? "Portfolio"}`;
  const description = project.subtitle[locale];
  const pageUrl = getAbsolutePageUrl(`/${locale}/projects/${project.slug}`);

  return {
    title,
    description,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title,
      description,
      type: "article",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      ...(pageUrl ? { url: pageUrl } : {}),
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const project = getPublicProjectBySlug(slug);

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

      {/* 头部：返回入口 + 时间 + 标题（GitHub / 在线演示入口已按需求移除） */}
      <header className="space-y-4">
        <div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {project.startDate} – {project.endDate[locale]}
          </p>
          <h1
            className="mt-2 text-2xl sm:text-3xl font-bold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {project.title[locale]}
          </h1>
        </div>
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
              {/* 结果段落含多段工程化叙述与 **加粗** 量化指标，统一由 RichText 渲染 */}
              <RichText
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--foreground)" }}
                text={project[key][locale]}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 核心量化数据：主题色加粗高亮 */}
      {project.metrics.length > 0 && (
        <section className="mt-10">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "核心量化数据" : "Key Quantitative Results"}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.metrics.map((metric) => (
              <li
                key={metric.en}
                className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold"
                style={{
                  color: "var(--accent)",
                  background: "var(--tag-bg)",
                  borderColor: "var(--tag-border)",
                }}
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
        </section>
      )}

      {/* 项目展示：位于「项目描述（STAR 叙述）」与「技术标签」之间 */}
      {project.images.length > 0 && (
        <section className="mt-10" aria-labelledby="project-gallery-heading">
          <h2
            id="project-gallery-heading"
            className="text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "项目展示" : "Project Gallery"}
          </h2>
          <ImageGallery
            images={project.images.map((image) => ({
              id: image.id,
              src: image.src,
              caption: image.caption[locale],
              alt: image.alt[locale],
            }))}
            locale={locale}
            lightboxLabel={
              locale === "zh" ? "项目展示图片预览" : "Project image preview"
            }
          />
        </section>
      )}

      <section className="mt-10">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "技术标签" : "Technology Tags"}
        </h2>
        {/* 技术标签 = 展示用 techTags + 项目亮点，保证与卡片标签一致 */}
        <ul className="mt-4 flex flex-wrap gap-2">
          {[
            ...project.techTags.map((tag) => tag[locale]),
            ...project.highlights.map((highlight) => highlight[locale]),
          ].map((tag) => (
            <li
              key={tag}
              className="rounded-full border px-2.5 py-1 text-xs"
              style={{
                background: "var(--tag-bg)",
                color: "var(--tag-text)",
                borderColor: "var(--tag-border)",
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      </section>

      {/* 相关文档下载：位于详情页底部 */}
      {project.documents.length > 0 && (
        <section className="mt-10" aria-labelledby="project-documents-heading">
          <h2
            id="project-documents-heading"
            className="text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "相关文档下载" : "Related Documents"}
          </h2>
          <ProjectDocuments documents={project.documents} locale={locale} />
        </section>
      )}
    </article>
  );
}
