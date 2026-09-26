import { Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PatentCard from "@/src/components/PatentCard";
import ResumeDownloadButton from "@/src/components/ResumeDownloadButton";
import { firstParagraph, toPlainText } from "@/src/components/RichText";
import {
  getContactHref,
  publicAbout,
  publicAwards,
  publicEducation,
  publicIdentity,
  publicPatents,
  publicProjects,
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
        {/*
          正式版下载入口：ResumeDownloadButton 统一指向 public/杨冲个人简历.pdf
          （本人提供的正式版简历，中英文页面共用同一份文件），
          网页版仅用于在线浏览，不再提供浏览器打印入口。
        */}
        <div
          className="mb-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--accent)",
            background: "var(--tag-bg)",
          }}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: "var(--tag-text)" }}>
              {locale === "zh" ? "正式版简历 PDF" : "Formal resume PDF"}
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: "var(--muted)" }}>
              {locale === "zh"
                ? "本页为在线浏览版；投递请下载排版固定的正式版 PDF。"
                : "This page is the online version. For applications, download the fixed-layout formal PDF."}
            </p>
          </div>
          <ResumeDownloadButton
            locale={locale}
            variant="primary"
            label={locale === "zh" ? "下载正式简历 PDF" : "Download formal resume PDF"}
          />
        </div>

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
            {publicAbout && (
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {locale === "zh" ? "求职意向：" : "Target roles: "}
                {publicAbout.jobTargets.map((target) => target[locale]).join(" / ")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {/*
            简历页头部只保留邮箱与电话（+ 下方微信）三项核心联系信息。
            个人网站与 GitHub 外链已按需求移除，避免打印/导出 PDF 时出现
            无效的蓝色下划线，版面更整洁。
          */}
          {identity.contacts.some(
            (contact) => contact.kind === "email" || contact.kind === "phone"
          ) && (
            <address className="flex flex-wrap gap-x-5 gap-y-2 not-italic">
              {identity.contacts
                .filter(
                  (contact) =>
                    contact.kind === "email" || contact.kind === "phone"
                )
                .map((contact) => {
                  const isEmail = contact.kind === "email";
                  return (
                    <a
                      key={contact.id}
                      href={getContactHref(contact)}
                      className="inline-flex min-w-0 items-center gap-1.5 break-all text-xs hover:underline sm:text-sm"
                      style={{ color: "var(--foreground)" }}
                      aria-label={
                        isEmail
                          ? locale === "zh"
                            ? `发送邮件至 ${contact.value}`
                            : `Email ${contact.value}`
                          : locale === "zh"
                            ? `拨打电话 ${contact.value}`
                            : `Call ${contact.value}`
                      }
                    >
                      {isEmail ? (
                        <Mail size={13} aria-hidden="true" />
                      ) : (
                        <Phone size={13} aria-hidden="true" />
                      )}
                      {contact.value}
                    </a>
                  );
                })}
            </address>
          )}

          {/* 微信等其余联系方式来自 about.contacts，与首页/联系我页保持一致 */}
          {publicAbout?.contacts.map((contact) => (
            <span
              key={contact.id}
              className="inline-flex min-w-0 items-center gap-1.5 break-all text-xs sm:text-sm"
              style={{ color: "var(--foreground)" }}
            >
              <MessageCircle size={13} aria-hidden="true" />
              {contact.label[locale]}
              {locale === "zh" ? "：" : ": "}
              {contact.value[locale]}
            </span>
          ))}
        </div>
      </header>

      {publicEducation.length > 0 && (
        <section className="resume-section mt-7" aria-labelledby="resume-education">
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
                  {entry.gpa ? ` · GPA ${entry.gpa[locale]}` : ""}
                </p>
                {entry.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                    {entry.highlights.map((highlight) => (
                      <li key={highlight.en}>{highlight[locale]}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}


      {publicProjects.length > 0 && (
        <section className="resume-section mt-7" aria-labelledby="resume-projects">
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
                  <h3 className="font-semibold">
                    {project.title[locale]}
                    <span
                      className="ml-2 text-xs font-normal"
                      style={{ color: "var(--muted)" }}
                    >
                      {project.role[locale]}
                    </span>
                  </h3>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {project.startDate} – {project.endDate[locale]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {project.subtitle[locale]}
                </p>
                {/* 打印简历保持单行摘要口径：取四段式结果的首段纯文本，完整叙述见项目详情页 */}
                <p className="mt-2 text-xs leading-5" style={{ color: "var(--foreground)" }}>
                  {toPlainText(firstParagraph(project.result[locale]))}
                </p>
                <p className="mt-2 text-xs leading-5" style={{ color: "var(--muted)" }}>
                  {project.coreSkill.map((entry) => entry[locale]).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {publicSkills.length > 0 && (
        <section className="resume-section mt-7" aria-labelledby="resume-skills">
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
        <section className="resume-section mt-7" aria-labelledby="resume-awards">
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
        <section className="resume-section mt-7" aria-labelledby="resume-patent">
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
