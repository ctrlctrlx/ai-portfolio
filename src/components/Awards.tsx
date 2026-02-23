import { Trophy } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import { resumeData } from "@/src/data/resumeData";

export default function Awards({ locale }: { locale: Locale }) {
  const { awards } = resumeData;

  return (
    <section>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        {locale === "zh" ? "荣誉奖项" : "Honors & Awards"}
      </h2>

      <div className="grid sm:grid-cols-2 gap-3">
        {awards.map((award, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border flex items-start gap-3"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            {/* Icon badge */}
            <div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--tag-bg)" }}
            >
              <Trophy size={15} style={{ color: "var(--accent)" }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                {award.title[locale]}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                {award.issuer[locale]}
              </p>
            </div>

            {/* Year tag */}
            <span
              className="shrink-0 self-start text-xs px-2 py-0.5 rounded-full border font-medium"
              style={{
                background: "var(--tag-bg)",
                color: "var(--tag-text)",
                borderColor: "var(--tag-border)",
              }}
            >
              {award.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
