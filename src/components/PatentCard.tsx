import type { Locale } from "@/src/lib/i18n";
import type { Patent, PatentType } from "@/src/data/profile";

const typeLabels: Record<PatentType, Record<Locale, string>> = {
  "utility-model": {
    zh: "实用新型专利",
    en: "Utility Model Patent",
  },
};

function formatGrantDate(grantDate: string, locale: Locale): string {
  const formattedDate = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    }
  ).format(new Date(`${grantDate}T00:00:00Z`));

  return locale === "zh"
    ? `授权于 ${formattedDate}`
    : `Granted in ${formattedDate}`;
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
    </article>
  );
}
