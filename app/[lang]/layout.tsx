import { isValidLocale } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ChatBox from "@/src/components/ChatBox";

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
