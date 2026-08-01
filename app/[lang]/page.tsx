import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Awards from "@/src/components/Awards";
import OpenChatButton from "@/src/components/OpenChatButton";
import PublicationCard from "@/src/components/PublicationCard";
import {
  getContactHref,
  getPublicContact,
  getSortedPublicProjects,
  publicEducation,
  publicIdentity,
  publicPatents,
  publicPublications,
  publicResearchAreas,
  publicSkills,
} from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { getAbsolutePageUrl } from "@/src/lib/siteUrl";

const iconMap: Record<string, React.ElementType> = {
  Github,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!publicIdentity) return {};

  const title = `${publicIdentity.name[locale]} | ${publicIdentity.tagline[locale]}`;
  const description = publicIdentity.bio[locale];
  const pageUrl = getAbsolutePageUrl(`/${locale}`);

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!publicIdentity) notFound();
  const identity = publicIdentity;

  const oppositeLocale: Locale = locale === "zh" ? "en" : "zh";
  const featuredProjects = getSortedPublicProjects().filter(
    (project) => project.featured
  );
  const currentEducation = publicEducation[0];
  const publicEmail = getPublicContact("email");
  const publicProfileLinks = publicIdentity.contacts.filter(
    (contact) => contact.kind === "website" || contact.kind === "github"
  );
  const featuredPatent = publicPatents[0];

  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl border px-5 py-8 sm:px-10 sm:py-12"
        style={{
          background:
            "linear-gradient(135deg, var(--card) 0%, var(--background) 72%)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p
              className="text-sm font-medium tracking-wide"
              style={{ color: "var(--accent)" }}
            >
              {publicIdentity.tagline[locale]}
            </p>
            <h1
              className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              {publicIdentity.name[locale]}
              <span
                className="ml-3 align-middle text-base font-normal sm:text-lg"
                style={{ color: "var(--muted)" }}
              >
                {publicIdentity.name[oppositeLocale]}
              </span>
            </h1>
            {currentEducation && (
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                {currentEducation.degree[locale]} · {currentEducation.major[locale]} ·{" "}
                {currentEducation.institution[locale]}
              </p>
            )}
            <p
              className="mt-5 max-w-2xl text-sm leading-7 sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              {publicIdentity.bio[locale]}
            </p>
            <div
              className="mt-4 flex items-center gap-1.5 text-xs"
              style={{ color: "var(--muted)" }}
            >
              <MapPin size={13} aria-hidden="true" />
              {publicIdentity.location[locale]}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ background: "var(--accent)" }}
              >
                {locale === "zh" ? "查看项目" : "View Projects"}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {publicResearchAreas.length > 0 && (
                <Link
                  href={`/${locale}/research`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  <BookOpen size={15} aria-hidden="true" />
                  {locale === "zh" ? "了解研究" : "Explore Research"}
                </Link>
              )}
              <OpenChatButton locale={locale} />
              {publicEmail && (
                <a
                  href={getContactHref(publicEmail)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[var(--card)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                  aria-label={
                    locale === "zh"
                      ? `发送邮件至公开求职邮箱 ${publicEmail.value}`
                      : `Email the public contact address ${publicEmail.value}`
                  }
                >
                  <Mail size={15} aria-hidden="true" />
                  {locale === "zh" ? "联系我" : "Contact"}
                </a>
              )}
              <Link
                href={`/${locale}/resume`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[var(--card)]"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--foreground)",
                }}
              >
                <FileText size={15} aria-hidden="true" />
                {locale === "zh" ? "在线简历" : "Resume"}
              </Link>
            </div>
            {publicProfileLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {publicProfileLinks.map((contact) => {
                  const Icon = iconMap[contact.icon ?? ""] ?? ExternalLink;
                  return (
                    <a
                      key={contact.id}
                      href={getContactHref(contact)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs hover:underline"
                      style={{ color: "var(--muted)" }}
                      aria-label={
                        locale === "zh"
                          ? `${identity.name.zh}的${contact.label.zh}（新窗口打开）`
                          : `${identity.name.en}'s ${contact.label.en} (opens in a new tab)`
                      }
                    >
                      <Icon size={13} aria-hidden="true" />
                      {contact.label[locale]}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mx-auto md:mx-0">
            <div
              className="h-28 w-28 overflow-hidden rounded-2xl border-2 sm:h-36 sm:w-36"
              style={{ borderColor: "var(--card-border)" }}
            >
              <Image
                src={publicIdentity.avatar}
                alt={
                  locale === "zh"
                    ? "作品集配图：晚霞与树影"
                    : "Portfolio image showing a sunset sky and tree silhouettes"
                }
                width={144}
                height={144}
                className="h-full w-full object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {publicSkills.length > 0 && (
        <section aria-labelledby="skills-heading">
          <div className="max-w-2xl">
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
              {locale === "zh" ? "能力证据" : "Capability Evidence"}
            </p>
            <h2
              id="skills-heading"
              className="mt-2 text-2xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {locale === "zh" ? "核心能力" : "Core Capabilities"}
            </h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publicSkills.map((category) => (
              <article
                key={category.id}
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--card-border)",
                }}
              >
                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                  {category.label[locale]}
                </h3>
                <ul className="mt-4 space-y-2">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className="text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {item.name[locale]}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section aria-labelledby="projects-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                {locale === "zh" ? "公开项目" : "Public Work"}
              </p>
              <h2
                id="projects-heading"
                className="mt-2 text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {locale === "zh" ? "代表项目" : "Featured Projects"}
              </h2>
            </div>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-1 text-sm hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {locale === "zh" ? "查看全部项目" : "View all projects"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="flex min-h-64 flex-col rounded-2xl border p-6"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--card-border)",
                }}
              >
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {project.startDate} – {project.endDate}
                </p>
                <h3
                  className="mt-3 text-lg font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {project.title[locale]}
                </h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {project.subtitle[locale]}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.coreSkill.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border px-2.5 py-1 text-xs"
                      style={{
                        borderColor: "var(--tag-border)",
                        color: "var(--tag-text)",
                        background: "var(--tag-bg)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {locale === "zh" ? "查看证据与结果" : "View evidence and outcomes"}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {publicEducation.length > 0 && (
        <section aria-labelledby="education-heading">
          <h2
            id="education-heading"
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "教育经历" : "Education"}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {publicEducation.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border p-6"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    {entry.institution[locale]}
                  </h3>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {entry.startDate} – {entry.endDate}
                  </span>
                </div>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {entry.degree[locale]} · {entry.major[locale]}
                </p>
                {entry.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {entry.highlights.map((highlight) => (
                      <li
                        key={highlight.zh}
                        className="text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        {highlight[locale]}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {publicPublications.length > 0 && (
        <section aria-labelledby="home-publications-heading">
          <h2
            id="home-publications-heading"
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "论文" : "Publications"}
          </h2>
          <div className="mt-6 space-y-4">
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

      {featuredPatent && (
        <section aria-labelledby="home-patents-heading">
          <h2
            id="home-patents-heading"
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "成果摘要" : "Outcome Summary"}
          </h2>
          <div
            className="mt-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <p className="text-sm leading-7" style={{ color: "var(--foreground)" }}>
              {locale === "zh"
                ? `${publicPatents.length} 项实用新型专利 · ${featuredPatent.role.zh} · ${featuredPatent.stageLabel.zh}`
                : `${publicPatents.length} Utility Model Patent · ${featuredPatent.role.en} · ${featuredPatent.stageLabel.en}`}
            </p>
            <Link
              href={`/${locale}/research#patents-heading`}
              className="inline-flex shrink-0 items-center gap-1 text-sm hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {locale === "zh" ? "查看专利信息" : "View patent details"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <Awards locale={locale} limit={3} />
    </div>
  );
}
