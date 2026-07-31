import { ArrowRight, Microscope } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PatentCard from "@/src/components/PatentCard";
import PublicationCard from "@/src/components/PublicationCard";
import {
  getPublicProjectBySlug,
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
  if (publicResearchAreas.length === 0) return {};

  const name = publicIdentity?.name[locale] ?? (locale === "zh" ? "作品集" : "Portfolio");
  const title =
    locale === "zh" ? `研究方向 | ${name}` : `Research Focus | ${name}`;
  const description =
    locale === "zh"
      ? `了解${name}当前公开的研究方向及其相关项目。`
      : `Explore ${name}'s currently public research focus and related projects.`;
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
  if (publicResearchAreas.length === 0) notFound();

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

      {publicPublications.length > 0 && (
        <section className="mt-14" aria-labelledby="publications-heading">
          <h2
            id="publications-heading"
            className="text-xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "论文" : "Publications"}
          </h2>
          <div className="mt-5 space-y-4">
            {publicPublications.map((publication) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                locale={locale}
              />
            ))}
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
            {locale === "zh" ? "专利" : "Patents"}
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
