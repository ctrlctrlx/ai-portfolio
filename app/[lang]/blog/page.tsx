import { getAllPostMetas } from "@/src/lib/posts";
import type { Locale } from "@/src/lib/i18n";
import Link from "next/link";
import { CalendarDays, Tag } from "lucide-react";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const posts = getAllPostMetas();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        {locale === "zh" ? "技术洞察" : "Tech Insights"}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {locale === "zh"
          ? "深入算法推导、工程实践与系统设计的学习笔记。"
          : "Deep dives into algorithm derivations, engineering practices, and system design."}
      </p>

      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {locale === "zh" ? "暂无文章，敬请期待。" : "No posts yet. Stay tuned."}
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="block p-5 rounded-xl border transition-colors hover:bg-[var(--card)]"
              style={{ borderColor: "var(--card-border)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                  {locale === "zh" ? post.title : post.titleEn}
                </h2>
                <div
                  className="flex items-center gap-1 text-xs shrink-0"
                  style={{ color: "var(--muted)" }}
                >
                  <CalendarDays size={12} />
                  <span>{post.date}</span>
                </div>
              </div>

              {post.summary && (
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {post.summary}
                </p>
              )}

              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Tag size={12} style={{ color: "var(--muted)" }} />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        background: "var(--tag-bg)",
                        color: "var(--tag-text)",
                        borderColor: "var(--tag-border)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
