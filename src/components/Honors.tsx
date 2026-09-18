import Link from "next/link";
import {
  ArrowRight,
  Award as AwardIcon,
  FileBadge,
  Medal,
  ScrollText,
} from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import type { BilingualText, Credential } from "@/src/data/profile";
import {
  publicAwards,
  publicCompetitions,
  publicCredentials,
} from "@/src/data/profile";

/** 首页预览模式下展示的条目数量 */
const PREVIEW_ITEM_COUNT = 3;

interface HonorsItem {
  id: string;
  title: string;
  issuer: string;
  year?: string;
}

/** 把三类证据统一成同一种渲染结构，避免三段重复的 JSX */
function toItems(
  locale: Locale,
  entries: Array<{
    id: string;
    title: BilingualText;
    issuer: BilingualText;
    year?: string;
  }>
): HonorsItem[] {
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title[locale],
    issuer: entry.issuer[locale],
    year: entry.year,
  }));
}

/**
 * 「荣誉与资质」板块。
 *
 * variant="full"    —— 荣誉独立页：荣誉奖项 / 竞赛获奖 / 证书与专利 / 学术论文 四类完整展开。
 * variant="preview" —— 首页预览：只列出按重要性排序的前 PREVIEW_ITEM_COUNT 条，
 *                      底部给出「查看更多」入口跳转 /[lang]/honors，四类与两篇 EI 论文
 *                      的完整内容仍在独立页展开，首页不重复全量信息。
 *
 * 全部数据来自 public + verified 集合，任一类为空时不渲染该分类，避免出现空标题。
 */
export default function Honors({
  locale,
  variant = "full",
}: {
  locale: Locale;
  variant?: "full" | "preview";
}) {
  // 证书与专利、学术论文共用 credentials 数据源，按 kind 拆分展示
  const credentialEntries: Credential[] = publicCredentials.filter(
    (entry) => entry.kind !== "paper"
  );
  const paperEntries: Credential[] = publicCredentials.filter(
    (entry) => entry.kind === "paper"
  );

  const categories = [
    {
      id: "awards",
      label: { zh: "荣誉奖项", en: "Honors & Awards" },
      icon: AwardIcon,
      items: toItems(locale, publicAwards),
    },
    {
      id: "competitions",
      label: { zh: "竞赛获奖", en: "Competitions" },
      icon: Medal,
      items: toItems(locale, publicCompetitions),
    },
    {
      id: "credentials",
      label: { zh: "证书与专利", en: "Certificates & Patents" },
      icon: FileBadge,
      items: toItems(locale, credentialEntries),
    },
    {
      id: "papers",
      label: { zh: "学术论文", en: "Academic Papers" },
      icon: ScrollText,
      items: toItems(locale, paperEntries),
    },
  ].filter((category) => category.items.length > 0);

  if (categories.length === 0) return null;

  // 首页预览：按分类优先级取前 3 条，并标注每条所属分类
  if (variant === "preview") {
    const previewItems = categories
      .flatMap((category) =>
        category.items.map((item) => ({
          ...item,
          categoryLabel: category.label[locale],
        }))
      )
      .slice(0, PREVIEW_ITEM_COUNT);

    const totalCount = categories.reduce(
      (sum, category) => sum + category.items.length,
      0
    );

    return (
      <section aria-labelledby="honors-heading">
        <div className="max-w-2xl">
          <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            {locale === "zh" ? "求职硬指标" : "Verified Credentials"}
          </p>
          <h2
            id="honors-heading"
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {locale === "zh" ? "荣誉与资质" : "Honors & Qualifications"}
          </h2>
        </div>

        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {previewItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-2xl border p-5 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
              }}
            >
              <span
                className="self-start rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
              >
                {item.categoryLabel}
              </span>
              <p
                className="mt-3 text-sm font-medium leading-6"
                style={{ color: "var(--foreground)" }}
              >
                {item.title}
              </p>
              <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
                {item.issuer}
                {item.year ? ` · ${item.year}` : ""}
              </p>
            </li>
          ))}
        </ul>

        <Link
          href={`/${locale}/honors`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          {locale === "zh"
            ? `查看更多（共 ${totalCount} 项荣誉、竞赛、证书与论文）`
            : `View more (${totalCount} honors, awards, certificates, and papers)`}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="honors-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          {locale === "zh" ? "求职硬指标" : "Verified Credentials"}
        </p>
        <h2
          id="honors-heading"
          className="mt-2 text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "荣誉与资质" : "Honors & Qualifications"}
        </h2>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <article
              key={category.id}
              className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--tag-bg)" }}
                >
                  <Icon size={15} style={{ color: "var(--accent)" }} aria-hidden="true" />
                </div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {category.label[locale]}
                </h3>
                <span
                  className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
                >
                  {category.items.length}
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {category.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium leading-6"
                        style={{ color: "var(--foreground)" }}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                        {item.issuer}
                        {item.year ? ` · ${item.year}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
