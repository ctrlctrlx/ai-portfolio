import Link from "next/link";
import {
  ArrowRight,
  Award as AwardIcon,
  ExternalLink,
  FileBadge,
  GraduationCap,
  Medal,
  ScrollText,
} from "lucide-react";
import AttachmentList from "@/src/components/AttachmentList";
import { formatYearMonth } from "@/src/lib/dateFormat";
import type { Locale } from "@/src/lib/i18n";
import type {
  Attachment,
  AwardLevel,
  BilingualText,
  Credential,
} from "@/src/data/profile";
import {
  awardLevelLabels,
  awardLevelOrder,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicPublications,
} from "@/src/data/profile";

/** 首页预览模式下展示的条目数量 */
const PREVIEW_ITEM_COUNT = 3;

/** 各级别对应的线性图标，提升分级辨识度 */
const levelIcons: Record<AwardLevel, React.ElementType> = {
  national: AwardIcon,
  provincial: Medal,
  university: GraduationCap,
};

interface HonorsItem {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  /** 该条目的证明材料（奖项 / 证书 / 专利可选；论文条目按约定不带附件） */
  attachments?: Attachment[];
  /**
   * 论文条目的 DOI 编号：由 publications.ts 按标题同源解析后注入
   * （证书集合中的论文条目只作分类引用，不重复存储 DOI）。
   */
  doi?: string;
}

/** 把三类证据统一成同一种渲染结构，避免三段重复的 JSX */
function toItems(
  locale: Locale,
  entries: Array<{
    id: string;
    title: BilingualText;
    issuer: BilingualText;
    year?: string;
    attachments?: Attachment[];
    doi?: string;
  }>
): HonorsItem[] {
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title[locale],
    issuer: entry.issuer[locale],
    year: entry.year,
    attachments: entry.attachments,
    doi: entry.doi,
  }));
}

/**
 * 「荣誉与资质」板块。
 *
 * variant="full"    —— 荣誉独立页：评奖与竞赛合并后按「国家级 → 省部级 → 校级」
 *                      分级展示（组内按时间倒序），证书与专利、学术论文各成一类。
 * variant="preview" —— 首页预览：只列出按分类优先级排序的前 PREVIEW_ITEM_COUNT 条，
 *                      底部给出「查看更多」入口跳转 /[lang]/honors，完整内容仍在独立页展开。
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

  // 评奖与竞赛合并后按级别分组，级别顺序固定为 国家级 → 省部级 → 校级
  const honorEntries = [...publicAwards, ...publicCompetitions];
  const categories = [
    ...awardLevelOrder.map((level) => ({
      id: `level-${level}`,
      label: awardLevelLabels[level],
      icon: levelIcons[level],
      items: toItems(
        locale,
        honorEntries
          .filter((entry) => entry.level === level)
          // 时间倒序；同年月返回 0 以保持数据层既定顺序（稳定排序）
          .sort((first, second) =>
            first.year < second.year
              ? 1
              : first.year > second.year
                ? -1
                : 0
          )
      ),
    })),
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
      // 论文条目的 DOI 从 publications.ts 按标题同源解析（唯一事实来源仍是 publications.ts）
      items: toItems(
        locale,
        paperEntries.map((entry) => ({
          ...entry,
          doi: publicPublications.find(
            (publication) => publication.title.zh === entry.title.zh
          )?.doi,
        }))
      ),
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
                {item.year ? ` · ${formatYearMonth(item.year, locale)}` : ""}
              </p>
              {/* 首页预览按需求隐藏所有附件入口，保持首屏简洁 */}
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

      {/* 分级卡片：三级奖励标题清晰、组别间留出更大间距以提升扫读区分度 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
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
                      {/*
                        颁发机构行与附件文字链同行：附件在右，同级次级文字色 + hover 下划线，
                        避免为附件单独占一行，缩短卡片纵向高度。
                      */}
                      <div className="mt-0.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {item.issuer}
                          {item.year ? ` · ${formatYearMonth(item.year, locale)}` : ""}
                        </p>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {/* 论文条目：直接展示完整 DOI 编号（与项目页学术成果同一格式） */}
                          {item.doi && (
                            <a
                              href={`https://doi.org/${item.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs hover:text-[var(--accent-hover)] hover:underline"
                              style={{ color: "var(--accent)" }}
                              aria-label={
                                locale === "zh"
                                  ? `DOI：在发布方网站查看论文《${item.title}》（新窗口打开）`
                                  : `DOI: view the paper "${item.title}" on the publisher site (opens in a new tab)`
                              }
                            >
                              <ExternalLink size={12} aria-hidden="true" />
                              {`DOI: ${item.doi}`}
                            </a>
                          )}
                          <AttachmentList
                            attachments={item.attachments}
                            locale={locale}
                          />
                        </span>
                      </div>
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
