import { ExternalLink } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import type { Patent, PatentStatus } from "@/src/data/profile";

const statusLabels: Record<PatentStatus, Record<Locale, string>> = {
  filed: { zh: "已申请", en: "Filed" },
  "under-review": { zh: "审查中", en: "Under review" },
  granted: { zh: "已授权", en: "Granted" },
};

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
          {statusLabels[patent.status][locale]}
        </span>
      </div>
      {patent.inventors.length > 0 && (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {patent.inventors.join(", ")}
        </p>
      )}
      {patent.year && (
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {patent.year}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {patent.summary[locale]}
      </p>
      {patent.publicUrl && (
        <a
          href={patent.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs hover:underline"
          style={{ color: "var(--accent)" }}
          aria-label={
            locale === "zh"
              ? `${patent.title.zh}公开记录`
              : `${patent.title.en} public record`
          }
        >
          {locale === "zh" ? "公开记录" : "Public record"} <ExternalLink size={11} />
        </a>
      )}
    </article>
  );
}
