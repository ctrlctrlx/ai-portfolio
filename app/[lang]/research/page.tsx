import { ArrowRight, CalendarDays, Microscope, ScrollText } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PatentCard from "@/src/components/PatentCard";
import {
  getPublicProjectBySlug,
  getPublicationAuthors,
  publicIdentity,
  publicPatents,
  publicPublications,
  publicResearchAreas,
} from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
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
  if (publicResearchAreas.length === 0 && publicPatents.length === 0) return {};

  const name = publicIdentity?.name[locale] ?? (locale === "zh" ? "作品集" : "Portfolio");
  const title =
    locale === "zh" ? `研究方向 | ${name}` : `Research Focus | ${name}`;
  const description =
    locale === "zh"
      ? `了解${name}当前公开的研究方向、相关项目与已核验的专利工程创新成果。`
      : `Explore ${name}'s public research focus, related projects, and verified patent-based engineering innovation.`;
  const pageUrl = getAbsolutePageUrl(`/${locale}/research`);

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

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (publicResearchAreas.length === 0 && publicPatents.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          <Microscope size={16} aria-hidden="true" />
          {locale === "zh" ? "公开且已核验" : "Public and verified"}
        </div>
        <h1
          className="mt-3 text-3xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "研究方向" : "Research Focus"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {locale === "zh"
            ? "本页仅呈现 Profile 数据层中已允许公开且完成核验的研究方向。"
            : "This page presents only research areas marked public and verified in the Profile data layer."}
        </p>
      </header>

      {publicResearchAreas.length > 0 && (
      <section className="mt-10" aria-labelledby="research-areas-heading">
        <h2
          id="research-areas-heading"
          className="text-xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "当前方向" : "Current areas"}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {publicResearchAreas.map((area) => {
            const relatedProjects = area.relatedProjectSlugs
              .map(getPublicProjectBySlug)
              .filter((project) => project !== null);

            return (
              <article
                key={area.id}
                className="rounded-2xl border p-6"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--card-border)",
                }}
              >
                <h3
                  className="text-base font-semibold leading-relaxed"
                  style={{ color: "var(--foreground)" }}
                >
                  {area.title[locale]}
                </h3>
                {relatedProjects.length > 0 && (
                  <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--card-border)" }}>
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
      </section>
      )}

      {publicPublications.length > 0 && (
        <section className="mt-14" aria-labelledby="publications-heading">
          <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
            <ScrollText size={16} aria-hidden="true" />
            {locale === "zh" ? "已发表成果" : "Published output"}
          </div>
          <h2
            id="publications-heading"
            className="mt-2 text-xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "学术成果" : "Academic Output"}
          </h2>

          <div className="mt-5 space-y-5">
            {publicPublications.map((publication) => {
              const relatedProjects = (publication.relatedProjectSlugs ?? [])
                .map(getPublicProjectBySlug)
                .filter((project) => project !== null);

              return (
                <article
                  key={publication.id}
                  className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  {/* 标题 + 作者身份徽章 */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3
                      className="text-base font-semibold leading-7"
                      style={{ color: "var(--foreground)" }}
                    >
                      {publication.title[locale]}
                    </h3>
                    {publication.authorRole && (
                      <span
                        className="shrink-0 self-start rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "var(--accent)",
                          color: "var(--accent-foreground)",
                        }}
                      >
                        {publication.authorRole[locale]}
                      </span>
                    )}
                  </div>

                  {/* 发表时间 · 会议 · 类型 */}
                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={12} aria-hidden="true" style={{ color: "var(--muted)" }} />
                      <dt className="sr-only">{locale === "zh" ? "发表时间" : "Published"}</dt>
                      <dd style={{ color: "var(--muted)" }}>
                        {publication.month ?? publication.year}
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="font-medium" style={{ color: "var(--muted)" }}>
                        {locale === "zh" ? "会议：" : "Venue: "}
                      </dt>
                      <dd style={{ color: "var(--foreground)" }}>
                        {publication.venue[locale]}
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="font-medium" style={{ color: "var(--muted)" }}>
                        {locale === "zh" ? "作者：" : "Authors: "}
                      </dt>
                      <dd style={{ color: "var(--foreground)" }}>
                        {getPublicationAuthors(
                          publication,
                          publicIdentity?.name[locale] ?? "",
                          locale
                        )
                          .map((author) => author.name)
                          .join(", ")}
                      </dd>
                    </div>
                  </dl>

                  {/* 核心创新点 */}
                  {publication.coreContribution && (
                    <div
                      className="mt-4 rounded-xl border p-4"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                        {locale === "zh" ? "核心创新点" : "Core contribution"}
                      </p>
                      <p
                        className="mt-1.5 text-sm leading-7"
                        style={{ color: "var(--foreground)" }}
                      >
                        {publication.coreContribution[locale]}
                      </p>
                    </div>
                  )}

                  {/* 量化指标：主题色加粗高亮 */}
                  {publication.metrics && publication.metrics.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2.5">
                      {publication.metrics.map((metric) => (
                        <li
                          key={metric.zh}
                          className="rounded-full border px-3 py-1 text-sm font-semibold"
                          style={{
                            color: "var(--accent)",
                            background: "var(--tag-bg)",
                            borderColor: "var(--tag-border)",
                          }}
                        >
                          {metric[locale]}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 关联项目：体现成果与项目互相支撑 */}
                  {relatedProjects.length > 0 && (
                    <div
                      className="mt-4 border-t pt-4"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                        {locale === "zh"
                          ? "对应项目成果落地"
                          : "Delivered through the project"}
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

                  {publication.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {publication.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border px-2.5 py-1 text-xs"
                          style={{
                            borderColor: "var(--card-border)",
                            color: "var(--muted)",
                          }}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {publicPatents.length > 0 && (
        <section className="mt-14" aria-labelledby="patents-heading">
          <h2
            id="patents-heading"
            className="text-xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh"
              ? "专利与工程创新"
              : "Patents & Engineering Innovation"}
          </h2>
          <div className="mt-5 space-y-4">
            {publicPatents.map((patent) => (
              <PatentCard key={patent.id} patent={patent} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
