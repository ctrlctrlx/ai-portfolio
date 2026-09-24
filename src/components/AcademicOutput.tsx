import Link from "next/link";
import { ArrowRight, CalendarDays, ScrollText } from "lucide-react";
import PatentCard from "@/src/components/PatentCard";
import type { Locale } from "@/src/lib/i18n";
import {
  getPublicProjectBySlug,
  getPublicationAuthors,
  publicIdentity,
  publicPatents,
  publicPublications,
} from "@/src/data/profile";

/**
 * 「学术成果」与「专利与工程创新」板块。
 *
 * 原位于 /[lang]/research；该路由已 301 重定向到 /[lang]/projects，
 * 因此把这两段内容整体迁入本组件并在项目经历页底部渲染，保证论文摘要、
 * 核心创新点、量化指标、DOI、关联项目与专利信息零丢失。
 *
 * 全部数据来自 public + verified 集合；两类都为空时不渲染。
 */
export default function AcademicOutput({ locale }: { locale: Locale }) {
  if (publicPublications.length === 0 && publicPatents.length === 0) {
    return null;
  }

  return (
    <>
      {publicPublications.length > 0 && (
        <section className="mt-14" aria-labelledby="publications-heading">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
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
              /**
               * 作者行文案：优先读取数据层的 author（由 identity 派生，如「第一作者：杨冲」），
               * 未提供时回退到 authors 顺序 + identity 姓名派生。
               */
              const authorLine =
                publication.author?.[locale] ??
                getPublicationAuthors(
                  publication,
                  publicIdentity?.name[locale] ?? "",
                  locale
                )
                  .map((author) => author.name)
                  .join(", ");

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
                      <CalendarDays
                        size={12}
                        aria-hidden="true"
                        style={{ color: "var(--muted)" }}
                      />
                      <dt className="sr-only">
                        {locale === "zh" ? "发表时间" : "Published"}
                      </dt>
                      <dd style={{ color: "var(--muted)" }}>
                        {publication.month ?? publication.year}
                      </dd>
                    </div>
                    {/* 会议行：venue 数据本身已带「EI 会议 / EI Conference」前缀 */}
                    <div className="flex items-center gap-1.5">
                      <dd style={{ color: "var(--foreground)" }}>
                        {publication.venue[locale]}
                        {/* DOI 链接：仅在数据层提供 doi 时渲染 */}
                        {publication.doi && (
                          <>
                            {" · "}
                            <a
                              href={`https://doi.org/${publication.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-words hover:underline"
                              style={{ color: "var(--accent)" }}
                              aria-label={
                                locale === "zh"
                                  ? `DOI：在发布方网站查看论文《${publication.title.zh}》（新窗口打开）`
                                  : `DOI: view the paper "${publication.title.en}" on the publisher site (opens in a new tab)`
                              }
                            >
                              DOI: {publication.doi}
                            </a>
                          </>
                        )}
                      </dd>
                    </div>
                    {/* 作者行：author 数据本身已带「第一作者：/ First author:」前缀 */}
                    <div className="flex items-center gap-1.5">
                      <dd style={{ color: "var(--foreground)" }}>{authorLine}</dd>
                    </div>
                  </dl>

                  {/* 核心创新点 */}
                  {publication.coreContribution && (
                    <div
                      className="mt-4 rounded-xl border p-4"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
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
                          key={metric.en}
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
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--muted)" }}
                      >
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
                            <ArrowRight
                              size={14}
                              className="shrink-0"
                              aria-hidden="true"
                            />
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
            {locale === "zh" ? "专利与工程创新" : "Patents & Engineering Innovation"}
          </h2>
          <div className="mt-5 space-y-4">
            {publicPatents.map((patent) => (
              <PatentCard key={patent.id} patent={patent} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
