import Link from "next/link";
import { ArrowRight, BadgeCheck, Briefcase, FlaskConical, Wrench } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import Education from "@/src/components/Education";
import ImageGallery from "@/src/components/ImageGallery";
import { publicAbout, publicIdentity } from "@/src/data/profile";

/** 三大核心优势各自固定一个图标，按 id 映射 */
const strengthIcons: Record<string, React.ElementType> = {
  "full-stack-engineering": Wrench,
  "rigorous-research": FlaskConical,
  "comprehensive-quality": BadgeCheck,
};

/**
 * 「关于我」板块。
 *
 * summaryOnly=true  —— 首页预览：只渲染精简版简介 + 政治面貌，
 *                      末尾给出「查看完整介绍」入口；实践经历与三大核心优势下沉到 /[lang]/about。
 * summaryOnly=false —— 内页完整版：精简版简介 + 教育经历（可选）+ 实践经历 + 三大核心优势。
 *
 * 籍贯字段已按本人要求全站移除，两种模式均不再展示。
 *
 * includeEducation：首页把「教育经历」提升为独立板块（需排在「荣誉与资质」之前），
 * 因此首页以 includeEducation={false} 调用，避免同一板块渲染两次。
 */
export default function About({
  locale,
  includeEducation = true,
  summaryOnly = false,
}: {
  locale: Locale;
  includeEducation?: boolean;
  summaryOnly?: boolean;
}) {
  if (!publicAbout || !publicIdentity) return null;

  const { headline, summary, politicalStatus, strengths, practice, practiceImages } =
    publicAbout;

  if (summaryOnly) {
    return (
      <section aria-labelledby="about-heading">
        <div className="max-w-3xl">
          <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            {locale === "zh" ? "关于我" : "About Me"}
          </p>
          <h2
            id="about-heading"
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "个人简介" : "Profile"}
          </h2>

          <p
            className="mt-5 text-sm leading-8"
            style={{ color: "var(--muted)" }}
          >
            {summary[locale]}
          </p>

          {/* 政治面貌 */}
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <dt className="font-medium" style={{ color: "var(--muted)" }}>
                {locale === "zh" ? "政治面貌" : "Political status"}：
              </dt>
              <dd style={{ color: "var(--foreground)" }}>
                {politicalStatus[locale]}
              </dd>
            </div>
          </dl>

          <Link
            href={`/${locale}/about`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            {locale === "zh" ? "查看完整个人介绍与核心优势" : "Read the full profile and core strengths"}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-14">
      {/* 个人简介 */}
      <section aria-labelledby="about-heading">
        <div className="max-w-3xl">
          <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            {locale === "zh" ? "关于我" : "About Me"}
          </p>
          <h2
            id="about-heading"
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "个人简介" : "Profile"}
          </h2>

          <p
            className="mt-5 text-base font-medium leading-8"
            style={{ color: "var(--foreground)" }}
          >
            {headline[locale]}
          </p>
          <p
            className="mt-4 text-sm leading-7"
            style={{ color: "var(--muted)" }}
          >
            {publicIdentity.bio[locale]}
          </p>

          {/* 政治面貌 + 籍贯 */}
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <dt className="font-medium" style={{ color: "var(--muted)" }}>
                {locale === "zh" ? "政治面貌" : "Political status"}：
              </dt>
              <dd style={{ color: "var(--foreground)" }}>
                {politicalStatus[locale]}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 教育经历：紧随个人简介，突出学历背景 */}
      {includeEducation && <Education locale={locale} />}

      {/* 实践经历：按阶段 → 职务 → 分项工作内容 → 量化成果 的结构化列表 */}
      {practice.length > 0 && (
        <section aria-labelledby="practice-heading">
          <h2
            id="practice-heading"
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "实践经历" : "Practical Experience"}
          </h2>

          <div className="mt-6 space-y-6">
            {practice.map((phase) => (
              <div key={phase.id}>
                {/* 阶段标题 */}
                <div className="flex items-center gap-2">
                  <Briefcase
                    size={15}
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  />
                  <h3
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: "var(--accent)" }}
                  >
                    {phase.phase[locale]}
                  </h3>
                </div>

                <div className="mt-3 space-y-4">
                  {phase.entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md motion-reduce:transition-none sm:p-6"
                      style={{
                        background: "var(--card)",
                        borderColor: "var(--card-border)",
                      }}
                    >
                      {/* 职务 + 时间 */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h4
                          className="text-base font-semibold leading-6"
                          style={{ color: "var(--foreground)" }}
                        >
                          {entry.title[locale]}
                        </h4>
                        <span
                          className="shrink-0 whitespace-nowrap text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          {entry.period[locale]}
                        </span>
                      </div>

                      {/* 角色 / 地点 */}
                      {(entry.role || entry.location) && (
                        <p
                          className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          {entry.role && (
                            <span
                              className="rounded-full px-2 py-0.5 font-medium"
                              style={{
                                background: "var(--tag-bg)",
                                color: "var(--tag-text)",
                              }}
                            >
                              {entry.role[locale]}
                            </span>
                          )}
                          {entry.location && <span>{entry.location[locale]}</span>}
                        </p>
                      )}

                      {/* 分项工作内容 */}
                      <ol className="mt-4 space-y-3">
                        {entry.bullets.map((bullet, index) => (
                          <li
                            key={bullet.text.zh}
                            className="flex items-start gap-3 text-sm leading-7"
                            style={{ color: "var(--muted)" }}
                          >
                            <span
                              aria-hidden="true"
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                              style={{
                                background: "var(--tag-bg)",
                                color: "var(--tag-text)",
                              }}
                            >
                              {index + 1}
                            </span>
                            <span className="min-w-0">
                              {bullet.text[locale]}
                              {/* 核心量化成果：主题色加粗高亮 */}
                              {bullet.metric && (
                                <span
                                  className="ml-1.5 inline-block font-semibold"
                                  style={{ color: "var(--accent)" }}
                                >
                                  {bullet.metric[locale]}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 实践经历配图：与项目展示共用同一套图片网格 + 灯箱 */}
          {practiceImages.length > 0 && (
            <div className="mt-8" aria-labelledby="practice-gallery-heading">
              <h3
                id="practice-gallery-heading"
                className="text-base font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {locale === "zh" ? "实践留影" : "Field Photos"}
              </h3>
              <ImageGallery
                images={practiceImages}
                locale={locale}
                lightboxLabel={{
                  zh: "实践经历图片预览",
                  en: "Practical experience image preview",
                }}
              />
            </div>
          )}
        </section>
      )}

      {/* 三大核心优势 */}
      <section aria-labelledby="strengths-heading">
        <h2
          id="strengths-heading"
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "三大核心优势" : "Three Core Strengths"}
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {strengths.map((strength) => {
            const Icon = strengthIcons[strength.id] ?? BadgeCheck;
            return (
              <article
                key={strength.id}
                className="group flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "var(--tag-bg)" }}
                >
                  <Icon size={18} style={{ color: "var(--accent)" }} aria-hidden="true" />
                </div>
                <h3
                  className="mt-4 text-base font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {strength.title[locale]}
                </h3>
                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  {strength.description[locale]}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
