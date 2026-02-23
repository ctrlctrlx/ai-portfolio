import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPostMetas } from "@/src/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import type { Locale } from "@/src/lib/i18n";
import Link from "next/link";
import { CalendarDays, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  const posts = getAllPostMetas();
  return ["zh", "en"].flatMap((lang) =>
    posts.map((post) => ({ lang, slug: post.slug }))
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1.5 text-sm mb-8 hover:underline"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} />
        {locale === "zh" ? "返回博客" : "Back to Blog"}
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          {locale === "zh" ? post.title : post.titleEn}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--muted)" }}
          >
            <CalendarDays size={12} />
            <span>{post.date}</span>
          </div>
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

        {post.summary && (
          <p
            className="mt-3 text-sm italic leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {post.summary}
          </p>
        )}
      </header>

      <hr style={{ borderColor: "var(--card-border)" }} className="mb-8" />

      {/* MDX Content */}
      <article className="prose-portfolio space-y-4 text-sm leading-relaxed">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm,remarkMath],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              rehypePlugins: [rehypeKatex as any],
            },
          }}
        />
      </article>
    </div>
  );
}
