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
          {sectionAuthor ? <div className="text-sm text-slate-600">作者：{sectionAuthor}</div> : null}
        </header>

        <ul className="space-y-3">
          {articles.map((p) => (
            <li
              key={`${p.section}/${p.slug}`}
              className="group relative overflow-hidden rounded-xl border border-emerald-900/10 bg-white/60 p-4 shadow-sm transition hover:border-emerald-900/15 hover:bg-white/80"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-400/30 via-cyan-300/15 to-blue-400/25" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-transparent to-transparent" />
              </div>
              <Link
                href={`/grandpa/${encodeURIComponent(p.section)}/${p.slug
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
                {p.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-emerald-900/10 bg-white/70 px-2 py-0.5">
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

