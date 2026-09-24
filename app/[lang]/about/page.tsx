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
      ? `${name}的个人定位、研究方向、教育与实践经历、三大核心优势与政治面貌。`
      : `${name}'s positioning, research directions, education and practical experience, core strengths, and political status.`;
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
        {/*
          原此处重复渲染 publicIdentity.bio，与下方 About 组件的「个人简介」板块完全一致；
          已移除，bio 只在 About 内渲染一次，页面结构改为：
          个人定位 → 研究方向 → 教育经历 → 实践经历 → 能力特点 → 政治面貌。
        */}
        <div className="mt-6">
          <ResumeDownloadButton locale={locale} />
        </div>
      </header>

      <div className="mt-12">
        <About locale={locale} />
      </div>

      {/* 联系我：与首页、联系我页共用同一组件；三处均展示邮箱/微信/电话三项 */}
      <div className="mt-16">
        <Contact locale={locale} showPhone />
      </div>
    </div>
  );
}
