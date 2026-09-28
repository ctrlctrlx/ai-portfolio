import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Bug,
  Cpu,
  Users,
  Wrench,
  GraduationCap,
} from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import { formatDateTokens } from "@/src/lib/dateFormat";
import Education from "@/src/components/Education";
import ImageGallery from "@/src/components/ImageGallery";
import { publicAbout, publicIdentity } from "@/src/data/profile";

/** 6 个能力模块各自固定一个图标，按 id 映射（复用现有图标库，不新增依赖） */
const strengthIcons: Record<string, React.ElementType> = {
  "algorithm-research": Brain,
  "engineering-delivery": Wrench,
  "edge-ai-deployment": Cpu,
  "debugging-root-cause": Bug,
  "learning-potential": GraduationCap,
  "overall-capability": Users,
};

/**
 * 「关于我」板块（完整版），由 /[lang]/about 使用。
 *
 * 结构：个人简介（bioSections[0] 身份标签行 + 6 个能力模块卡片，桌面 3 列 2 行）
 * → 教育经历（可选）→ 实践经历。
 * 简介正文段落（bioSections[1..]）不再在本页渲染，仅保留在数据层供求职问答使用。
 *
 * summaryOnly=true 为保留的精简预览模式（精简简介 + 政治面貌 + 「查看完整介绍」入口）：
 * 首页的「个人简介」板块已按要求整体移除，因此当前无调用方使用该模式，
 * 保留以便后续需要时在任意页面复用同一套简介文案。
 *
 * includeEducation：调用方若已单独渲染「教育经历」板块，传 false 避免重复渲染。
 *
 * 籍贯字段已按本人要求全站移除。
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

  const { bioSections, summary, strengths, practice, practiceImages } =
    publicAbout;

  /**
   * 个人简介只展示 bioSections[0]（身份标签行）；
   * 其后的正文段落保留在数据层供求职问答「自我介绍」使用，不在本页渲染。
   */
  const tagSection = bioSections[0];

  if (summaryOnly) {
    return (
      <section aria-labelledby="about-heading">
        <div className="max-w-3xl">
          {/* 原「关于我」小标题与本节「个人简介」重复，已移除，仅保留模块标题 */}
          <h2
            id="about-heading"
            className="text-2xl font-bold"
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

          <Link
            href={`/${locale}/about`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            {locale === "zh" ? "查看完整个人介绍与核心能力" : "Read the full profile and core capabilities"}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-14">
      {/*
        个人简介：顶部保留 bioSections[0] 的身份标签行（整行加粗），
        正文（bioSections[1..]）不再在本页渲染，改为紧随其后的 6 个能力模块卡片，
        避免「大段简介 + 能力卡片」两处信息重复。
        数据层仍保留完整简介正文——它是求职问答「自我介绍」的取词来源
        （career-agent 的 buildIntroduction 与 verify:chat 的同源断言依赖它）。
      */}
      <section aria-labelledby="about-heading">
        <div className="max-w-3xl">
          <h2
            id="about-heading"
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "个人简介" : "Profile"}
          </h2>

          {/* 顶部身份标签行 */}
          {tagSection && (
            <p
              className="mt-5 text-sm leading-7"
              style={{ color: "var(--muted)" }}
            >
              {tagSection.segments.map((segment, segmentIndex) => (
                <span
                  key={`${tagSection.id}-${segmentIndex}`}
                  style={
                    segment.strong
                      ? { color: "var(--foreground)", fontWeight: 600 }
                      : undefined
                  }
                >
                  {segment.text[locale]}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* 6 个能力模块：桌面 3 列 2 行、平板 2 列 3 行、移动端单列 */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {strengths.map((strength) => {
            const Icon = strengthIcons[strength.id] ?? Brain;
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
                          {/* 实践经历时间：数据层为双语字符串，展示层按 locale 本地化 YYYY.MM 记号 */}
                          {formatDateTokens(entry.period[locale], locale)}
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
                            key={bullet.text.en}
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
                images={practiceImages.map((image) => ({
                  id: image.id,
                  src: image.src,
                  caption: image.caption[locale],
                  alt: image.alt[locale],
                }))}
                locale={locale}
                lightboxLabel={
                  locale === "zh"
                    ? "实践经历图片预览"
                    : "Practical experience image preview"
                }
              />
            </div>
          )}
        </section>
      )}

    </div>
  );
}
