import { Mail, MessageCircle, Phone } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";
import {
  getContactHref,
  getPublicContact,
  publicAbout,
} from "@/src/data/profile";

/**
 * 「联系我」板块。
 *
 * - 邮箱值统一从 Profile 数据层的公开求职邮箱读取（全站只允许该地址出现一次）。
 * - 其余联系方式卡片（微信等）完全由 about.contacts 驱动，组件不再硬编码，
 *   避免数据层与组件两处各写一份导致不一致。
 * - 电话来自 identity.contacts 的 phone 条目（本人已授权公开），
 *   仅在 showPhone=true 时渲染：目前只有 /[lang]/contact 开启，
 *   首页与「关于我」页共用的调用不传该开关，因此不暴露电话。
 * - 籍贯字段已按本人要求移除。
 * - showHeading=false 用于已有页面级 h1 的独立路由，避免重复标题。
 */
export default function Contact({
  locale,
  showHeading = true,
  showPhone = false,
}: {
  locale: Locale;
  showHeading?: boolean;
  showPhone?: boolean;
}) {
  if (!publicAbout) return null;

  const publicEmail = getPublicContact("email");
  const publicPhone = showPhone ? getPublicContact("phone") : null;
  const { contactHeading, contactNote, contacts } = publicAbout;

  const cards = [
    ...(publicEmail
      ? [
          {
            id: "contact-email",
            icon: Mail,
            label: { zh: "邮箱", en: "Email" },
            value: publicEmail.value,
            href: getContactHref(publicEmail),
            ariaLabel:
              locale === "zh"
                ? `发送邮件至公开求职邮箱 ${publicEmail.value}`
                : `Email the public contact address ${publicEmail.value}`,
          },
        ]
      : []),
    ...contacts.map((contact) => ({
      id: contact.id,
      icon: MessageCircle,
      label: contact.label,
      value: contact.value[locale],
      href: undefined,
      ariaLabel: undefined,
    })),
    // 电话置于邮箱、微信之下；href 为 tel:，移动端可直接拨号
    ...(publicPhone
      ? [
          {
            id: publicPhone.id,
            icon: Phone,
            label: publicPhone.label,
            value: publicPhone.value,
            href: getContactHref(publicPhone),
            ariaLabel:
              locale === "zh"
                ? `拨打电话 ${publicPhone.value}`
                : `Call ${publicPhone.value}`,
          },
        ]
      : []),
  ];

  return (
    <section aria-labelledby={showHeading ? "contact-heading" : undefined}>
      {showHeading && (
        <>
          <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            {locale === "zh" ? "求职中，欢迎联系" : "Open to opportunities"}
          </p>
          <h2
            id="contact-heading"
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {contactHeading[locale]}
          </h2>
        </>
      )}
      <p
        className={showHeading ? "mt-3 text-sm" : "text-sm"}
        style={{ color: "var(--muted)" }}
      >
        {contactNote[locale]}
      </p>

      <div
        className={
          cards.length >= 3
            ? // 邮箱 + 微信 + 电话：桌面三等宽排列，窄屏自动降为两列/单列
              "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "mt-6 grid gap-4 sm:grid-cols-2"
        }
      >
        {cards.map((card) => {
          const Icon = card.icon;
          // 横向布局：左图标、右「标题 + 内容」两行，图标与文字整块垂直居中
          const cardClass =
            "flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none";
          const cardStyle = {
            background: "var(--card)",
            borderColor: "var(--card-border)",
          };
          const body = (
            <>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--tag-bg)" }}
              >
                <Icon size={16} style={{ color: "var(--accent)" }} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {card.label[locale]}
                </p>
                <p
                  className="mt-0.5 break-all text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {card.value}
                </p>
              </div>
            </>
          );

          return card.href ? (
            <a
              key={card.id}
              href={card.href}
              className={cardClass}
              style={cardStyle}
              aria-label={card.ariaLabel}
            >
              {body}
            </a>
          ) : (
            <div key={card.id} className={cardClass} style={cardStyle}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
