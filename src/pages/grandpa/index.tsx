import type { GetStaticProps } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";

type ArticleItem = {
  slug: string;
  title: string;
  date?: string;
  tags?: string[];
};

type Props = {
  articles: ArticleItem[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { loadCollection } = await import("@/lib/content/fs");
  const articles = loadCollection("grandpa").map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags
  }));
  return { props: { articles } };
};

export default function GrandpaIndexPage({ articles }: Props) {
  return (
    <SiteLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">爷爷的文章</h2>
          <p className="text-sm text-zinc-400">所有文章均来自 `content/grandpa/`。</p>
        </header>

        <ul className="space-y-3">
          {articles.map((p) => (
            <li key={p.slug} className="rounded-lg border border-zinc-800 p-4">
              <Link href={`/grandpa/${p.slug}`} className="hover:underline">
                <div className="text-base font-medium">{p.title}</div>
              </Link>
              <div className="mt-1 text-sm text-zinc-400">{p.date}</div>
              {p.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-zinc-800 px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </SiteLayout>
  );
}

