import type { GetStaticProps } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";

type Item = {
  slug: string;
  title: string;
  date?: string;
  tags?: string[];
};

type Props = {
  posts: Item[];
  projects: Item[];
  grandpa: Item[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { loadCollection } = await import("@/lib/content/fs");

  const posts = loadCollection("post")
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      date: p.frontmatter.date,
      tags: p.frontmatter.tags
    }));

  const projects = loadCollection("project")
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      date: p.frontmatter.date,
      tags: p.frontmatter.tags
    }));

  const grandpa = loadCollection("grandpa")
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      date: p.frontmatter.date,
      tags: p.frontmatter.tags
    }));

  return { props: { posts, projects, grandpa } };
};

export default function HomePage({ posts, projects, grandpa }: Props) {
  return (
    <SiteLayout>
      <div className="space-y-12">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">个人网站</h2>
          <p className="text-zinc-300">
            这里会展示我的文章、项目和一些独立页面。内容主要来自 Obsidian（Markdown +
            Frontmatter）。
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">最新博客</h3>
            <Link className="text-sm text-zinc-300 hover:text-white" href="/blog">
              查看全部 →
            </Link>
          </div>
          <ul className="space-y-3">
            {posts.map((p) => (
              <li
                key={p.slug}
                className="relative rounded-lg border border-zinc-800 p-4 hover:bg-zinc-900/30"
              >
                <Link
                  href={`/blog/${p.slug}`}
                  className="absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  <span className="sr-only">{p.title}</span>
                </Link>
                <div className="relative">
                  <div className="text-base font-medium">{p.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{p.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">爷爷的文章</h3>
            <Link className="text-sm text-zinc-300 hover:text-white" href="/grandpa">
              查看全部 →
            </Link>
          </div>
          <ul className="space-y-3">
            {grandpa.map((p) => (
              <li
                key={p.slug}
                className="relative rounded-lg border border-zinc-800 p-4 hover:bg-zinc-900/30"
              >
                <Link
                  href={`/grandpa/${p.slug
                    .split("/")
                    .map((seg) => encodeURIComponent(seg))
                    .join("/")}`}
                  className="absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  <span className="sr-only">{p.title}</span>
                </Link>
                <div className="relative">
                  <div className="text-base font-medium">{p.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{p.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">精选项目</h3>
            <Link className="text-sm text-zinc-300 hover:text-white" href="/projects">
              查看全部 →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <li
                key={p.slug}
                className="relative rounded-lg border border-zinc-800 p-4 hover:bg-zinc-900/30"
              >
                <Link
                  href={`/projects/${p.slug}`}
                  className="absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  <span className="sr-only">{p.title}</span>
                </Link>
                <div className="relative">
                  <div className="text-base font-medium">{p.title}</div>
                  {p.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-zinc-800 px-2 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteLayout>
  );
}

