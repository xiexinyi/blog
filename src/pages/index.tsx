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
        <section className="space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/60 px-3 py-1 text-xs text-slate-700 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
              更新于本地 Obsidian
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">个人网站</h2>
          </div>
          <p className="max-w-2xl text-slate-700">
            这里会展示我的文章、项目和一些独立页面。内容主要来自 Obsidian（Markdown + Frontmatter）。
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">最新博客</h3>
            <Link className="text-sm text-slate-700 hover:text-slate-950" href="/blog">
              查看全部 →
            </Link>
          </div>
          <ul className="space-y-3">
            {posts.map((p) => (
              <li
                key={p.slug}
                className="group relative overflow-hidden rounded-xl border border-emerald-900/10 bg-white/60 p-4 shadow-sm transition hover:border-emerald-900/15 hover:bg-white/80"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-400/30 via-cyan-300/15 to-blue-400/25" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-transparent to-transparent" />
                </div>
                <Link
                  href={`/blog/${p.slug}`}
                  className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                >
                  <span className="sr-only">{p.title}</span>
                </Link>
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-base font-medium tracking-tight">{p.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{p.date}</div>
                    </div>
                    <div className="mt-0.5 text-slate-400 transition group-hover:text-slate-700">→</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">爷爷的文章</h3>
            <Link className="text-sm text-slate-700 hover:text-slate-950" href="/grandpa">
              查看全部 →
            </Link>
          </div>
          <ul className="space-y-3">
            {grandpa.map((p) => (
              <li
                key={p.slug}
                className="group relative overflow-hidden rounded-xl border border-emerald-900/10 bg-white/60 p-4 shadow-sm transition hover:border-emerald-900/15 hover:bg-white/80"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-400/30 via-cyan-300/15 to-blue-400/25" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-transparent to-transparent" />
                </div>
                <Link
                  href={`/grandpa/${p.slug
                    .split("/")
                    .map((seg) => encodeURIComponent(seg))
                    .join("/")}`}
                  className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                >
                  <span className="sr-only">{p.title}</span>
                </Link>
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-base font-medium tracking-tight">{p.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{p.date}</div>
                    </div>
                    <div className="mt-0.5 text-slate-400 transition group-hover:text-slate-700">→</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">精选项目</h3>
            <Link className="text-sm text-slate-700 hover:text-slate-950" href="/projects">
              查看全部 →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <li
                key={p.slug}
                className="group relative overflow-hidden rounded-xl border border-emerald-900/10 bg-white/60 p-4 shadow-sm transition hover:border-emerald-900/15 hover:bg-white/80"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-400/30 via-cyan-300/15 to-blue-400/25" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-transparent to-transparent" />
                </div>
                <Link
                  href={`/projects/${p.slug}`}
                  className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                >
                  <span className="sr-only">{p.title}</span>
                </Link>
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-base font-medium tracking-tight">{p.title}</div>
                    </div>
                    <div className="mt-0.5 text-slate-400 transition group-hover:text-slate-700">→</div>
                  </div>
                  {p.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-emerald-900/10 bg-white/70 px-2 py-0.5"
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

