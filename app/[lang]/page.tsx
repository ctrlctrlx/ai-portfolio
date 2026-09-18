import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Mail,
  MapPin,
  ScrollText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import About from "@/src/components/About";
import Contact from "@/src/components/Contact";
import Education from "@/src/components/Education";
import Honors from "@/src/components/Honors";
import OpenChatButton from "@/src/components/OpenChatButton";
import ResumeDownloadButton from "@/src/components/ResumeDownloadButton";
import Skills from "@/src/components/Skills";
import type { Project } from "@/src/data/profile";
import {
  getContactHref,
  getProjectsPublications,
  getPublicContact,
  getSortedPublicProjects,
  publicAbout,
  publicEducation,
  publicIdentity,
  publicResearchAreas,
} from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { getAbsolutePageUrl } from "@/src/lib/siteUrl";

const iconMap: Record<string, React.ElementType> = {
  Github,
  Globe,
  Mail,
};

/**
 * 首页只展示最高权重的 2 个代表项目。
 * 用显式 slug 指定，而不是对按时间排序的列表取前 N 个，
 * 避免新增/调整项目时间后首页展示的项目被静默替换。
 * 其余项目与全部指标、技术标签完整保留在 /[lang]/projects 内页。
 */
const HOME_PROJECT_SLUGS = ["fish-reid-open-world", "rfid-multiview-acquisition"];

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

/**
 * 首页代表项目预览卡片。
 * 只保留：项目名称、角色徽章、一句话概述、1 项最核心量化亮点，以及「查看详情」入口。
 * 完整描述、全部指标、技术标签与论文关联均在 /[lang]/projects/[slug] 详情页展开。
 */
function ProjectPreviewCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const leadMetric = project.metrics[0];
  const relatedPublications = getProjectsPublications(project);

  return (
    <article
      className="flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
      style={{
        background: "var(--card)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="pt-1 text-xs" style={{ color: "var(--muted)" }}>
          {project.startDate} – {project.endDate}
        </p>
        {/* 项目角色徽章：固定在卡片右上角 */}
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {project.role[locale]}
        </span>
      </div>

      <h3
        className="mt-3 text-lg font-semibold leading-7"
        style={{ color: "var(--foreground)" }}
      >
        {project.title[locale]}
      </h3>

      {/* 一句话简短概述 */}
      <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
        {project.subtitle[locale]}
      </p>

      {/* 1 项最核心量化亮点 */}
      {leadMetric && (
        <p
          className="mt-5 inline-flex items-center gap-2 text-base font-semibold"
          style={{ color: "var(--accent)" }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          {leadMetric[locale]}
        </p>
      )}

      {/* 论文关联标注：有公开论文时保留 */}
      {relatedPublications.map((publication) => (
        <p
          key={publication.id}
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: "var(--tag-bg)",
            color: "var(--tag-text)",
          }}
        >
          <ScrollText size={12} aria-hidden="true" />
          {locale === "zh"
            ? `一作 EI 会议论文 ${publication.year}`
            : `First-author EI paper, ${publication.year}`}
        </p>
      ))}

      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium hover:underline"
        style={{ color: "var(--accent)" }}
      >
        {locale === "zh" ? "查看详情" : "View details"}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </article>
  );
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
  const featuredProjects = HOME_PROJECT_SLUGS.map((slug) =>
    getSortedPublicProjects().find((project) => project.slug === slug)
  ).filter((project): project is Project => project !== undefined);
  const currentEducation = publicEducation[0];
  const publicEmail = getPublicContact("email");
  const publicProfileLinks = publicIdentity.contacts.filter(
    (contact) => contact.kind === "website" || contact.kind === "github"
  );

  return (
    <div className="mx-auto max-w-6xl space-y-28 px-4 py-12 sm:space-y-32 sm:px-6 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl border px-5 py-8 sm:px-10 sm:py-12"
        style={{
          background:
            "linear-gradient(135deg, var(--card) 0%, var(--background) 72%)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:gap-12">
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
                {currentEducation.institution[locale]} · {currentEducation.startDate} –{" "}
                {currentEducation.endDate}
              </p>
            )}

            {/* 求职意向 */}
            {publicAbout && publicAbout.jobTargets.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {locale === "zh" ? "求职意向" : "Seeking"}
                </span>
                {publicAbout.jobTargets.map((target) => (
                  <span
                    key={target.zh}
                    className="rounded-full border px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: "var(--tag-bg)",
                      color: "var(--tag-text)",
                      borderColor: "var(--tag-border)",
                    }}
                  >
                    {target[locale]}
                  </span>
                ))}
              </div>
            )}

            {/* 一句话个人定位 */}
            {publicAbout && (
              <p
                className="mt-5 max-w-2xl text-base font-medium leading-8"
                style={{ color: "var(--foreground)" }}
              >
                {publicAbout.headline[locale]}
              </p>
            )}

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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
              >
                {locale === "zh" ? "查看项目" : "View Projects"}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {publicAbout && (
                <a
                  href="#about-heading"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  {locale === "zh" ? "关于我" : "About Me"}
                </a>
              )}
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
              {/* 正式版简历下载：指向本地 public/resume.pdf */}
              <ResumeDownloadButton locale={locale} />
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
          {/* 照片卡片：PC 端明显放大为矩形，移动端限制宽度并居中，不与正文重叠 */}
          <div className="mx-auto w-full max-w-[21rem] md:mx-0 md:max-w-[24rem] md:justify-self-end">
            <div
              className="relative w-full overflow-hidden rounded-3xl border shadow-lg"
              style={{
                aspectRatio: "4 / 3",
                borderColor: "var(--card-border)",
                background: "var(--background)",
              }}
            >
              <Image
                src={publicIdentity.avatar}
                alt={
                  locale === "zh"
                    ? "杨冲的个人照片：户外溪流旁张开双臂"
                    : "Portrait photo of Yang Chong with arms outstretched beside an outdoor stream"
                }
                width={960}
                height={720}
                className="h-full w-full object-cover object-center"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/*
        首页板块顺序（严格遵循）：
        Hero 首屏 → 个人简介（精简）→ 教育经历 → 荣誉与资质（预览）
        → 技能栈（精简）→ 代表项目（2 个预览卡片）→ 联系我
        完整内容全部下沉：实践经历与核心优势 → /[lang]/about，
        全部荣誉/竞赛/证书/论文 → /[lang]/honors，第三项目与全部指标 → /[lang]/projects。
      */}
      {publicAbout && <About locale={locale} summaryOnly />}

      <Education locale={locale} />

      <Honors locale={locale} variant="preview" />

      <Skills locale={locale} variant="compact" />

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
              <ProjectPreviewCard key={project.id} project={project} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {publicAbout && <Contact locale={locale} />}
    </div>
  );
}
