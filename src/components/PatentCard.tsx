import AttachmentList from "@/src/components/AttachmentList";
import { formatYearMonth } from "@/src/lib/dateFormat";
import type { Locale } from "@/src/lib/i18n";
import type { Patent, PatentType } from "@/src/data/profile";

const typeLabels: Record<PatentType, Record<Locale, string>> = {
  "utility-model": {
    zh: "实用新型专利",
    en: "Utility Model Patent",
  },
};

/**
 * 授权时间：数据层 grantDate 为 ISO 日期，展示层统一按全站格式输出
 * （中文 `2022.03`、英文 `Mar. 2022`），与证书与专利列表、简历页保持一致。
 */
function formatGrantDate(grantDate: string, locale: Locale): string {
  const yearMonth = formatYearMonth(
    grantDate.slice(0, 7).replace("-", "."),
    locale
  );

  return locale === "zh" ? `授权于 ${yearMonth}` : `Granted ${yearMonth}`;
}

export default function PatentCard({
  patent,
  locale,
}: {
  patent: Patent;
  locale: Locale;
}) {
  return (
    <article
      className="rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
          {patent.title[locale]}
        </h3>
        <span
          className="shrink-0 rounded-full border px-2 py-0.5 text-xs"
          style={{
            background: "var(--tag-bg)",
            borderColor: "var(--tag-border)",
            color: "var(--tag-text)",
          }}
        >
          {typeLabels[patent.type][locale]}
        </span>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="sr-only">{locale === "zh" ? "发明人顺序" : "Inventor role"}</dt>
          <dd style={{ color: "var(--foreground)" }}>{patent.role[locale]}</dd>
        </div>
        <div>
          <dt className="sr-only">{locale === "zh" ? "专利号" : "Patent number"}</dt>
          <dd className="font-mono text-xs" style={{ color: "var(--muted)" }}>
            {patent.patentNumber}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{locale === "zh" ? "授权日期" : "Grant date"}</dt>
          <dd style={{ color: "var(--muted)" }}>
            {formatGrantDate(patent.grantDate, locale)}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{locale === "zh" ? "阶段定位" : "Stage"}</dt>
          <dd style={{ color: "var(--muted)" }}>{patent.stageLabel[locale]}</dd>
        </div>
      </dl>
      {/* 专利证书等附件：文字链样式，与荣誉页一致，右对齐 */}
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <AttachmentList attachments={patent.attachments} locale={locale} />
      </div>
    </article>
  );
}
