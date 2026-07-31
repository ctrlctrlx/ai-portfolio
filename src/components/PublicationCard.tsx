import { ExternalLink } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import type { Publication, PublicationStatus } from "@/src/data/profile";

const statusLabels: Record<PublicationStatus, Record<Locale, string>> = {
  draft: { zh: "草稿", en: "Draft" },
  submitted: { zh: "已投稿", en: "Submitted" },
  "under-review": { zh: "审稿中", en: "Under review" },
  accepted: { zh: "已接收", en: "Accepted" },
  "camera-ready": { zh: "终稿", en: "Camera-ready" },
  published: { zh: "已发表", en: "Published" },
  indexed: { zh: "已收录", en: "Indexed" },
};

export default function PublicationCard({
  publication,
  locale,
}: {
  publication: Publication;
  locale: Locale;
}) {
  return (
    <article
      className="rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
          {publication.title[locale]}
        </h3>
        <span
          className="shrink-0 rounded-full border px-2 py-0.5 text-xs"
          style={{
            background: "var(--tag-bg)",
            borderColor: "var(--tag-border)",
            color: "var(--tag-text)",
          }}
        >
          {statusLabels[publication.status][locale]}
        </span>
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        {publication.authors.map((author) => author.name).join(", ")}
      </p>
      <p className="mt-1 text-xs italic" style={{ color: "var(--muted)" }}>
        {publication.venue[locale]} · {publication.year}
      </p>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {publication.abstract[locale]}
      </p>
      {(publication.doi || publication.arxivUrl) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs hover:underline"
              style={{ color: "var(--accent)" }}
              aria-label={`${publication.title[locale]} DOI`}
            >
              DOI <ExternalLink size={11} />
            </a>
          )}
          {publication.arxivUrl && (
            <a
              href={publication.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs hover:underline"
              style={{ color: "var(--accent)" }}
              aria-label={`${publication.title[locale]} arXiv`}
            >
              arXiv <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
