import { ExternalLink, Mail } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PatentCard from "@/src/components/PatentCard";
import PrintResumeButton from "@/src/components/PrintResumeButton";
import {
  getContactHref,
  publicAwards,
  publicEducation,
  publicIdentity,
  publicPatents,
  publicProjects,
  publicResearchAreas,
  publicSkills,
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
  const name =
    publicIdentity?.name[locale] ?? (locale === "zh" ? "作品集" : "Portfolio");
  const title =
    locale === "zh" ? `在线公开简历 | ${name}` : `Public Resume | ${name}`;
  const description =
    locale === "zh"
      ? `${name}的双语在线公开简历，仅包含已核验并允许公开的资料。`
      : `${name}'s bilingual public resume, containing only verified information approved for public use.`;
  const pageUrl = getAbsolutePageUrl(`/${locale}/resume`);

  return {
    title,
    description,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title,
      description,
      type: "profile",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      ...(pageUrl ? { url: pageUrl } : {}),
    },
  };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!publicIdentity) notFound();

  const identity = publicIdentity;

  return (
    <article className="resume-page mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header
        className="resume-section rounded-3xl border p-6 sm:p-8"
        style={{
          background: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
              {locale === "zh" ? "在线公开简历" : "Public Resume"}
            </p>
            <h1
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              {identity.name[locale]}
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {identity.tagline[locale]}
            </p>
          </div>
          <PrintResumeButton locale={locale} />
        </div>

        {identity.contacts.length > 0 && (
          <address className="mt-6 flex flex-wrap gap-x-5 gap-y-2 not-italic">
            {identity.contacts.map((contact) => {
              const isEmail = contact.kind === "email";
              return (
                <a
                  key={contact.id}
                  href={getContactHref(contact)}
                  {...(!isEmail
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex min-w-0 items-center gap-1.5 break-all text-xs hover:underline sm:text-sm"
                  style={{ color: "var(--foreground)" }}
                  aria-label={
                    isEmail
                      ? locale === "zh"
                        ? `发送邮件至 ${contact.value}`
                        : `Email ${contact.value}`
                      : locale === "zh"
                        ? `${contact.label.zh}（新窗口打开）`
                        : `${contact.label.en} (opens in a new tab)`
                  }
                >
                  {isEmail ? (
                    <Mail size={13} aria-hidden="true" />
                  ) : (
                    <ExternalLink size={13} aria-hidden="true" />
                  )}
                  {contact.value}
                </a>
              );
            })}
          </address>
        )}
      </header>

      {publicEducation.length > 0 && (
        <section className="resume-section mt-10" aria-labelledby="resume-education">
          <h2 id="resume-education" className="resume-heading">
            {locale === "zh" ? "教育经历" : "Education"}
          </h2>
          <div className="mt-4 space-y-4">
            {publicEducation.map((entry) => (
              <article
                key={entry.id}
                className="resume-item rounded-xl border p-5"
                style={{ borderColor: "var(--card-border)" }}
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-semibold">{entry.institution[locale]}</h3>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {entry.startDate} – {entry.endDate}
                  </span>
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {entry.degree[locale]} · {entry.major[locale]}
                </p>
                {entry.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                    {entry.highlights.map((highlight) => (
                      <li key={highlight.zh}>{highlight[locale]}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {publicResearchAreas.length > 0 && (
        <section className="resume-section mt-10" aria-labelledby="resume-research">
          <h2 id="resume-research" className="resume-heading">
            {locale === "zh" ? "研究方向" : "Research Interests"}
          </h2>
          <ul className="mt-4 space-y-2">
            {publicResearchAreas.map((area) => (
              <li key={area.id} className="text-sm leading-6">
                {area.title[locale]}
              </li>
            ))}
          </ul>
        </section>
      )}

      {publicProjects.length > 0 && (
        <section className="resume-section mt-10" aria-labelledby="resume-projects">
          <h2 id="resume-projects" className="resume-heading">
            {locale === "zh" ? "项目经历" : "Projects"}
          </h2>
          <div className="mt-4 space-y-4">
            {publicProjects.map((project) => (
              <article
                key={project.id}
                className="resume-item rounded-xl border p-5"
                style={{ borderColor: "var(--card-border)" }}
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-semibold">{project.title[locale]}</h3>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {project.startDate} – {project.endDate}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {project.subtitle[locale]}
                </p>
                <p className="mt-2 text-xs leading-5" style={{ color: "var(--muted)" }}>
                  {project.coreSkill.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {publicSkills.length > 0 && (
        <section className="resume-section mt-10" aria-labelledby="resume-skills">
          <h2 id="resume-skills" className="resume-heading">
            {locale === "zh" ? "核心技能" : "Core Skills"}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {publicSkills.map((category) => (
              <article key={category.id} className="resume-item">
                <h3 className="text-sm font-semibold">{category.label[locale]}</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {category.items.map((item) => item.name[locale]).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {publicAwards.length > 0 && (
        <section className="resume-section mt-10" aria-labelledby="resume-awards">
          <h2 id="resume-awards" className="resume-heading">
            {locale === "zh" ? "荣誉奖项" : "Honors & Awards"}
          </h2>
          <div className="mt-4 space-y-3">
            {publicAwards.map((award) => (
              <article
                key={award.id}
                className="resume-item flex flex-wrap justify-between gap-2 text-sm"
              >
                <div>
                  <h3 className="font-semibold">{award.title[locale]}</h3>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                    {award.issuer[locale]}
                  </p>
                </div>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {award.year}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      {publicPatents.length > 0 && (
        <section className="resume-section mt-10" aria-labelledby="resume-patent">
          <h2 id="resume-patent" className="resume-heading">
            {locale === "zh" ? "专利" : "Patent"}
          </h2>
          <div className="mt-4 space-y-4">
            {publicPatents.map((patent) => (
              <PatentCard key={patent.id} patent={patent} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
