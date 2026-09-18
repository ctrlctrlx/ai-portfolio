import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Honors from "@/src/components/Honors";
import {
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicIdentity,
} from "@/src/data/profile";
import type { Locale } from "@/src/lib/i18n";
import { getAbsolutePageUrl } from "@/src/lib/siteUrl";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const name =
    publicIdentity?.name[locale] ?? (locale === "zh" ? "作品集" : "Portfolio");
  const title =
    locale === "zh" ? `荣誉与资质 | ${name}` : `Honors & Qualifications | ${name}`;
  const description =
    locale === "zh"
      ? `${name}的荣誉奖项、竞赛获奖、证书与专利清单。`
      : `${name}'s honors, competition awards, certificates, and patents.`;
  const pageUrl = getAbsolutePageUrl(`/${locale}/honors`);

  return {
    title,
    description,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title,
      description,
      type: "profile",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      ...(pageUrl ? { url: pageUrl } : {}),
    },
  };
}

export default async function HonorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;

  if (
    publicAwards.length === 0 &&
    publicCompetitions.length === 0 &&
    publicCredentials.length === 0
  ) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "荣誉与资质" : "Honors & Qualifications"}
        </h1>
        <p className="mt-3 text-sm leading-7" style={{ color: "var(--muted)" }}>
          {locale === "zh"
            ? "本页只呈现已核验的荣誉奖项、竞赛获奖、证书与专利。"
            : "This page presents only verified honors, competition awards, certificates, and patents."}
        </p>
      </header>

      <div className="mt-10">
        <Honors locale={locale} />
      </div>
    </div>
  );
}
