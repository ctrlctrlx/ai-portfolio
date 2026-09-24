import { isValidLocale } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ChatBox from "@/src/components/ChatBox";
import DocumentLocale from "@/src/components/DocumentLocale";
import {
  getPublicContact,
  publicAbout,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicIdentity,
} from "@/src/data/profile";

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

  /**
   * AI 助理开场白在服务端按 locale 组装成纯字符串后再下发。
   * 这样 ChatBox 这个客户端组件无需引用 profile 数据层，
   * 避免整个双语 profile 数据集被序列化进客户端 chunk（尤其影响英文页面）。
   */
  const candidateName =
    publicIdentity?.name[locale] ?? (locale === "zh" ? "候选人" : "the candidate");
  const chatGreeting =
    locale === "zh"
      ? `你好！我是${candidateName}的求职信息助理。请问您想了解哪个项目或技能？`
      : `Hi! I'm ${candidateName}'s career information assistant. What project or skill would you like to know about?`;

  /**
   * 导航与页脚只需要「哪些板块可用」这一布尔信息与署名文本。
   * 在这里（服务端）判定后再传给客户端组件，客户端就不必引用 profile 数据层，
   * 双语数据集因此不会进入浏览器资源包。
   */
  const siteName =
    publicIdentity?.name[locale] ?? (locale === "zh" ? "作品集" : "Portfolio");
  const publicEmail = getPublicContact("email")?.value ?? null;
  const publicPhone = getPublicContact("phone")?.value ?? null;
  const hasHonors =
    publicAwards.length > 0 ||
    publicCompetitions.length > 0 ||
    publicCredentials.length > 0;
  /** 页脚额外联系方式（微信等）：label / value 均在服务端按 locale 解析为纯字符串 */
  const footerContacts = (publicAbout?.contacts ?? []).map((contact) => ({
    id: contact.id,
    label: contact.label[locale],
    value: contact.value[locale],
  }));

  return (
    <>
      <DocumentLocale lang={locale} />
      {/*
        跳转到主内容：默认视觉隐藏，键盘 Tab 首次聚焦时出现在视口左上角，
        点击/回车后把焦点交给 <main id="main-content">，跳过导航与语言切换。
      */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {locale === "zh" ? "跳转至主内容" : "Skip to main content"}
      </a>
      <Navbar
        lang={locale}
        name={siteName}
        hasAbout={publicAbout !== null}
        hasHonors={hasHonors}
      />
      {/* tabIndex=-1 让锚点跳转后焦点真正落在主内容区域 */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer
        lang={locale}
        brandName={siteName}
        copyrightName={publicIdentity?.name.en ?? "Yang Chong"}
        email={publicEmail}
        phone={publicPhone}
        hasHonors={hasHonors}
        extraContacts={footerContacts}
      />
      <ChatBox lang={locale} greeting={chatGreeting} />
    </>
  );
}

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}
