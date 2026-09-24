import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  const title = locale === "zh" ? `联系我 | ${name}` : `Contact | ${name}`;
  const description =
    locale === "zh"
      ? `${name}的公开联系方式：求职邮箱、微信与电话。`
      : `${name}'s public contact details: email, WeChat, and phone.`;
  const pageUrl = getAbsolutePageUrl(`/${locale}/contact`);

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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!publicAbout) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? "联系我" : "Contact"}
        </h1>
        <p className="mt-3 text-sm leading-7" style={{ color: "var(--muted)" }}>
          {locale === "zh"
            ? "以下为公开联系方式；如需正式版简历，可点击下方按钮下载 PDF。"
            : "Below are my public contact details. For the formal resume, download the PDF with the button below."}
        </p>
        <div className="mt-6">
          <ResumeDownloadButton locale={locale} />
        </div>
      </header>

      <div className="mt-10">
        {/* showPhone：仅联系页展示已授权公开的电话；首页/关于页不传该开关 */}
        <Contact locale={locale} showHeading={false} showPhone />
      </div>
    </div>
  );
}
