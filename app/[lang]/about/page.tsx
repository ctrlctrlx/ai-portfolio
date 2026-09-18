import { notFound } from "next/navigation";
import type { Metadata } from "next";
import About from "@/src/components/About";
import Contact from "@/src/components/Contact";
import ResumeDownloadButton from "@/src/components/ResumeDownloadButton";
import { publicAbout, publicIdentity } from "@/src/data/profile";
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
  const title = locale === "zh" ? `关于我 | ${name}` : `About | ${name}`;
  const description =
    locale === "zh"
      ? `${name}的个人简介、政治面貌与三大核心优势：全栈工程能力、严谨科研素养、综合素质过硬。`
      : `${name}'s profile, political status, and three core strengths: full-stack engineering, rigorous research practice, and comprehensive capability.`;
  const pageUrl = getAbsolutePageUrl(`/${locale}/about`);

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!publicAbout || !publicIdentity) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "关于我" : "About Me"}
        </h1>
        {/* 完整版个人简介：首页只展示精简 summary，此处保留全量 bio */}
        <p
          className="mt-4 text-sm leading-8"
          style={{ color: "var(--muted)" }}
        >
          {publicIdentity.bio[locale]}
        </p>
        <div className="mt-6">
          <ResumeDownloadButton locale={locale} />
        </div>
      </header>

      <div className="mt-12">
        <About locale={locale} />
      </div>

      {/* 联系我：与首页、联系我页共用同一组件，保证全站联系方式一致 */}
      <div className="mt-16">
        <Contact locale={locale} />
      </div>
    </div>
  );
}
