import {
  ArrowRight,
  Mail,
  MapPin,
  ScrollText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Contact from "@/src/components/Contact";
import Education from "@/src/components/Education";
import Honors from "@/src/components/Honors";
import OpenChatButton from "@/src/components/OpenChatButton";
import ResearchDirectionTags from "@/src/components/ResearchDirectionTags";
import ResumeDownloadButton from "@/src/components/ResumeDownloadButton";
import Skills from "@/src/components/Skills";
import type { Project } from "@/src/data/profile";
import {
  getProjectsPublications,
  getSortedPublicProjects,
  publicAbout,
  publicEducation,
  publicIdentity,
  publicPublications,
} from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { getAbsolutePageUrl } from "@/src/lib/siteUrl";

/**
 * 首页展示 4 个代表项目（当前公开项目全集，按最新在前排列）。
 * 用显式 slug 指定，而不是对按时间排序的列表取前 N 个，
 * 避免新增/调整项目时间后首页展示的项目被静默替换。
 * 每个项目的全部指标、技术标签与图文详情在 /[lang]/projects 与详情页展开。
 */
const HOME_PROJECT_SLUGS = [
  "personal-portfolio-website",
  "fish-reid-open-world",
  "rfid-multiview-acquisition",
  "grouper-tagging-standard",
];

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
          {project.startDate} – {project.endDate[locale]}
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

      <div className="mt-auto pt-6">
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {locale === "zh" ? "查看详情" : "View details"}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
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

  const allProjects = getSortedPublicProjects();
  const featuredProjects = HOME_PROJECT_SLUGS.map((slug) =>
    allProjects.find((project) => project.slug === slug)
  ).filter((project): project is Project => project !== undefined);
  /** 首屏核心亮点短句用到的可核验计数，直接从公开数据派生 */
  const publicProjectCount = allProjects.length;
  const eiPaperCount = publicPublications.filter(
    (publication) => publication.publicationType === "ei-conference"
  ).length;
  const currentEducation = publicEducation[0];

  /**
   * 籍贯 · 现居行（政治面貌已独立成行，见下方 JSX）。
   * 籍贯来自 about.nativePlace（本人已授权公开），现居来自 identity.location；
   * 缺数据时对应片段自动省略。
   */
  const locationParts = [
    publicAbout
      ? locale === "zh"
        ? `籍贯：${publicAbout.nativePlace.zh}`
        : `Hometown: ${publicAbout.nativePlace.en}`
      : null,
    locale === "zh"
      ? `现居：${publicIdentity.location.zh}`
      : `Based in ${publicIdentity.location.en}`,
  ].filter((part): part is string => part !== null);

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 sm:space-y-22 sm:px-6 sm:py-16">
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
              {/*
                中文姓名对照仅保留在中文首页；英文首页不再出现任何中文字符
                （原「杨冲」副标题会以中文出现在 /en 首屏）。
              */}
              {locale === "zh" && (
                <span
                  className="ml-3 align-middle text-base font-normal sm:text-lg"
                  style={{ color: "var(--muted)" }}
                >
                  {publicIdentity.name.en}
                </span>
              )}
            </h1>
            {currentEducation && (
              /*
                学历信息行：按 HR 阅读优先级排序
                「学校 | 专业 | 学位 | GPA | 起止时间」，全部取自 education.ts
                结构化字段（GPA 与起止时间自动同步，无独立硬编码）。
                视觉层级：正文主色 + 加粗 + text-base（较原次级小字提升一级），
                权重仅次于姓名，与下方政治面貌行同级。

                响应式：窄屏（<lg）两组各自成行——第一行「学校 | 专业」、
                第二行「学位 | GPA | 起止时间」；桌面端（lg+）合并为单行。
                组内分隔符写作「空格 + 竖线 + 不换行空格」，竖线始终跟随后一段文字，
                不会单独滞留在行尾。
              */
              <p
                className="mt-4 text-base font-semibold leading-7"
                style={{ color: "var(--foreground)" }}
              >
                <span className="block lg:inline">
                  {currentEducation.institution[locale]}
                  {" |\u00A0"}
                  {currentEducation.major[locale]}
                </span>
                {/* 组间分隔符仅桌面端显示；窄屏用换行体现两组界限，避免行尾滞留竖线 */}
                <span className="hidden lg:inline">{" |\u00A0"}</span>
                <span className="block lg:inline">
                  {currentEducation.degree[locale]}
                  {currentEducation.gpa && (
                    <>
                      {" |\u00A0"}GPA {currentEducation.gpa[locale]}
                    </>
                  )}
                  {" |\u00A0"}
                  {currentEducation.startDate} – {currentEducation.endDate}
                </span>
              </p>
            )}

            {/* 政治面貌行：独立成行，位于「求职方向」上方，与学历行同级视觉权重 */}
            {publicAbout && (
              <p
                className="mt-2 text-base font-semibold leading-7"
                style={{ color: "var(--foreground)" }}
              >
                {publicAbout.politicalStatus[locale]}
              </p>
            )}

            {/*
              求职方向：名称/头衔下方的次级强调文字，替代原「求职意向」标签组，
              避免同一处出现两套不同的求职目标表述；移动端自然换行，不溢出。
              文案直接取 about.jobTargets，保证与简历页「求职意向」全站唯一口径。
            */}
            {publicAbout && publicAbout.jobTargets.length > 0 && (
              <p
                className="mt-4 max-w-2xl text-sm leading-7"
                style={{ color: "var(--muted)" }}
              >
                {locale === "zh" ? "求职方向：" : "Job Objective: "}
                {publicAbout.jobTargets.map((target) => target[locale]).join(" / ")}
              </p>
            )}

            {/* 研究方向标签行：与项目经历页顶部标签统一样式，便于快速匹配研究领域 */}
            <div className="mt-4">
              <ResearchDirectionTags locale={locale} />
            </div>

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
              className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs"
              style={{ color: "var(--muted)" }}
            >
              <MapPin size={13} aria-hidden="true" />
              {/* 籍贯 / 现居 / 政治面貌同一行，用间隔符分隔，不新增独立行 */}
              <span>{locationParts.join(" · ")}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {/* 主操作：下载正式版简历 PDF（唯一实心主按钮，操作层级清晰） */}
              <ResumeDownloadButton locale={locale} variant="primary" />
              <Link
                href={`/${locale}/projects`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--foreground)",
                }}
              >
                {locale === "zh" ? "查看项目" : "View Projects"}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {publicAbout && (
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--card)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  {locale === "zh" ? "关于我" : "About Me"}
                </Link>
              )}
              <OpenChatButton locale={locale} />
              {publicAbout && (
                /*
                  「联系我」改为站内路由跳转，与顶部导航栏最右侧入口指向完全一致
                  （原为 mailto: 直接发邮件）。当前页跳转、不打开新标签页，
                  按钮样式、图标与文字保持不变。
                */
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[var(--card)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  <Mail size={15} aria-hidden="true" />
                  {locale === "zh" ? "联系我" : "Contact"}
                </Link>
              )}
              {/* 「在线简历」与「了解研究」按钮已移除：研究内容整合进项目经历页 */}
            </div>
            {/*
              核心亮点短句：数量由数据层派生（EI 会议论文数 / 公开落地项目数），
              不在组件内硬编码个人事实，数据变动时文案自动跟随。
            */}
            <p
              className="mt-4 max-w-2xl text-sm leading-7"
              style={{ color: "var(--muted)" }}
            >
              {locale === "zh"
                ? `软硬协同工程型硕士 | ${eiPaperCount}篇EI会议论文 | ${publicProjectCount}个落地项目`
                : `Engineering Master with Software-Hardware Skills | ${eiPaperCount} EI Papers | ${publicProjectCount} Field Projects`}
            </p>
            {/* 个人网站 / GitHub 外链小图标组已按需求从首屏移除，联系方式统一收敛到在线简历页与页脚 */}
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
                /* 首屏核心图片：eager + preload 优先加载，避免 LCP 延迟 */
                loading="eager"
                preload
                fetchPriority="high"
                /* 移动端卡片满宽，md 起固定为 24rem 卡片宽度 */
                sizes="(max-width: 767px) 100vw, 384px"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/*
        首页板块顺序（严格遵循）：
        Hero 首屏 → 教育经历 → 荣誉与资质（预览）→ 技能栈（精简）
        → 代表项目（2 个预览卡片）→ 联系我
        个人简介板块已整体移除（正文与完整三段式简介下沉到 /[lang]/about），
        首屏因此承担定位表达，并新增一行核心亮点短句。
        完整内容下沉：个人简介与实践经历/核心优势 → /[lang]/about，
        全部荣誉/竞赛/证书/论文 → /[lang]/honors，第三项目与全部指标 → /[lang]/projects。
      */}
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

      {publicAbout && <Contact locale={locale} showPhone />}
    </div>
  );
}
