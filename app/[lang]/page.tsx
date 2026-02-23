import remarkGfm from 'remark-gfm';
import { resumeData, formatAuthors, getSortedProjects } from "@/src/data/resumeData";
import type { Locale } from "@/src/lib/i18n";
import { Github, Linkedin, Mail, MapPin, Download, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Typewriter from "@/src/components/Typewriter";

const iconMap: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  Mail,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const { personalInfo, education, publications } = resumeData;
  const featuredProjects = getSortedProjects().filter((p) => p.featured);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row items-start gap-8">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2" style={{ borderColor: "var(--card-border)" }}>
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name[locale]}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              {personalInfo.name[locale]}
            </h1>
            <p className="mt-1 text-base" style={{ color: "var(--accent)" }}>
              <Typewriter text={personalInfo.tagline[locale]} />
            </p>
          </div>

          <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--muted)" }}>
            {personalInfo.bio[locale]}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
            <MapPin size={12} />
            <span>{personalInfo.location[locale]}</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={personalInfo.resumePdfUrl}
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: "var(--accent)" }}
            >
              <Download size={14} />
              {locale === "zh" ? "下载简历" : "Download CV"}
            </a>

            {personalInfo.socialLinks.map((link) => {
              const Icon = iconMap[link.icon ?? ""] ?? Mail;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-[var(--card)]"
                  style={{ color: "var(--muted)", borderColor: "var(--card-border)" }}
                  aria-label={link.platform}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{link.platform}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Education ────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          {locale === "zh" ? "教育经历" : "Education"}
        </h2>
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-5 rounded-xl border"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div>
                  <h3 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>
                    {edu.institution[locale]}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {edu.degree[locale]} · {edu.major[locale]}
                    {edu.gpa && <span className="ml-2">GPA {edu.gpa}</span>}
                  </p>
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              {edu.highlights.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {edu.highlights.map((h, i) => (
                    <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--muted)" }}>
                      <span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />
                      {h[locale]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Publications ─────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          {locale === "zh" ? "论文与专利" : "Publications & Patents"}
        </h2>
        <div className="space-y-4">
          {publications.map((pub) => {
            const authors = formatAuthors(pub);
            return (
              <div
                key={pub.id}
                className="p-5 rounded-xl border"
                style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
              >
                {/* Title */}
                <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--foreground)" }}>
                  {pub.title}
                </h3>

                {/* Authors */}
                <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
                  {authors.map((a, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      <span style={a.isHighlighted ? { color: "var(--accent)", fontWeight: 600 } : {}}>
                        {a.name}
                      </span>
                    </span>
                  ))}
                </p>

                {/* Venue & year */}
                <p className="mt-1 text-xs italic" style={{ color: "var(--muted)" }}>
                  {pub.venue[locale]}, {pub.year}
                  {pub.patentNo && <span className="ml-2 not-italic">({pub.patentNo})</span>}
                </p>

                {/* Abstract */}
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {pub.abstract[locale]}
                </p>

                {/* Tags + links */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {pub.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{ background: "var(--tag-bg)", color: "var(--tag-text)", borderColor: "var(--tag-border)" }}
                    >
                      {tag}
                    </span>
                  ))}
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs flex items-center gap-1 hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      DOI <ExternalLink size={10} />
                    </a>
                  )}
                  {pub.arxivUrl && (
                    <a
                      href={pub.arxivUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      arXiv <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            {locale === "zh" ? "精选项目" : "Featured Projects"}
          </h2>
          <Link
            href={`/${locale}/projects`}
            className="text-sm flex items-center gap-1 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            {locale === "zh" ? "查看全部" : "View all"} →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {featuredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-xl border flex flex-col gap-3"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  {proj.title[locale]}
                </h3>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  {proj.subtitle[locale]}
                </p>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2">
                {proj.metrics.slice(0, 3).map((m, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full border font-medium"
                    style={{ background: "var(--tag-bg)", color: "var(--tag-text)", borderColor: "var(--tag-border)" }}
                  >
                    {m[locale]}
                  </span>
                ))}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {proj.coreSkill.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-1.5 py-0.5 rounded border"
                    style={{ color: "var(--muted)", borderColor: "var(--card-border)" }}
                  >
                    {skill}
                  </span>
                ))}
                {proj.coreSkill.length > 5 && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    +{proj.coreSkill.length - 5}
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 mt-auto pt-1">
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
                <Link
                  href={`/${locale}/projects`}
                  className="ml-auto text-xs flex items-center gap-1 hover:underline"
                  style={{ color: "var(--muted)" }}
                >
                  <BookOpen size={12} />
                  {locale === "zh" ? "详情" : "Details"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
