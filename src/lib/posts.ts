import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  titleEn: string;
  date: string;
  summary: string;
  tags: string[];
}

export interface PostData extends PostMeta {
  content: string;
}

export function getAllPostMetas(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: (data.title as string) ?? slug,
        titleEn: (data.titleEn as string) ?? slug,
        date: (data.date as string) ?? "",
        summary: (data.summary as string) ?? "",
        tags: (data.tags as string[]) ?? [],
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): PostData | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title as string) ?? slug,
    titleEn: (data.titleEn as string) ?? slug,
    date: (data.date as string) ?? "",
    summary: (data.summary as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    content,
  };
}
