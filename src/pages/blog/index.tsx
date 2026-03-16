import type { GetStaticProps } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";

type PostItem = {
  slug: string;
  title: string;
  date?: string;
  tags?: string[];
};

type Props = {
  posts: PostItem[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { loadCollection } = await import("@/lib/content/fs");
  const posts = loadCollection("post").map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags
  }));
  return { props: { posts } };
};

export default function BlogIndexPage({ posts }: Props) {
  return (
    <SiteLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">博客</h2>
          <p className="text-sm text-zinc-400">所有文章均来自 `content/blog/`。</p>
        </header>

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
      </div>
    </SiteLayout>
  );
}

