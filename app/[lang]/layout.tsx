import { isValidLocale } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ChatBox from "@/src/components/ChatBox";
import DocumentLocale from "@/src/components/DocumentLocale";
import { resumeData } from "@/src/data/resumeData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;
  const { name, tagline, bio } = resumeData.personalInfo;
  const title = `${name[locale]} | ${tagline[locale]}`;
  const description = bio[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  return (
    <>
      <DocumentLocale lang={locale} />
      <Navbar lang={locale} />
      <main>{children}</main>
      <Footer lang={locale} />
      <ChatBox lang={locale} />
    </>
  );
}

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}
