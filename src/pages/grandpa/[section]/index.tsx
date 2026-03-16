import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";

type ArticleItem = {
  section: string;
  slug: string;
  title: string;
  date?: string;
  order: number | null;
  tags?: string[];
};

type Props = {
  section: string;
  sectionTitle: string;
  sectionAuthor: string | null;
  articles: ArticleItem[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { loadCollection } = await import("@/lib/content/fs");
  const sections = Array.from(
    new Set(loadCollection("grandpa").map((p) => p.slug.split("/")[0]).filter(Boolean))
  );
  return {
    paths: sections.map((section) => ({ params: { section } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const { loadCollection, getGrandpaSectionDisplayTitle, getGrandpaSectionMeta } = await import(
    "@/lib/content/fs"
  );
  const section = String(ctx.params?.section || "");
  const sectionTitle = getGrandpaSectionDisplayTitle(section);
  const sectionAuthor = getGrandpaSectionMeta(section)?.author ?? null;

  const articles = loadCollection("grandpa")
    .filter((p) => p.slug.startsWith(`${section}/`))
    .map((p) => {
      const [, ...rest] = p.slug.split("/");
      return {
        section,
        slug: rest.join("/"),
        title: p.frontmatter.title,
        date: p.frontmatter.date,
        order: typeof p.frontmatter.order === "number" ? p.frontmatter.order : null,
        tags: p.frontmatter.tags
      };
    })
    .filter((p) => p.slug.length > 0);

  articles.sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return (b.date || "").localeCompare(a.date || "");
  });

  return { props: { section, sectionTitle, sectionAuthor, articles } };
};

export default function GrandpaSectionIndexPage({
  section,
  sectionTitle,
  sectionAuthor,
  articles
}: Props) {
  return (
    <SiteLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
          {sectionAuthor ? <div className="text-sm text-zinc-400">作者：{sectionAuthor}</div> : null}
        </header>

        <ul className="space-y-3">
          {articles.map((p) => (
            <li
              key={`${p.section}/${p.slug}`}
              className="relative rounded-lg border border-zinc-800 p-4 hover:bg-zinc-900/30"
            >
              <Link
                href={`/grandpa/${encodeURIComponent(p.section)}/${p.slug
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
                {p.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-zinc-800 px-2 py-0.5">
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

