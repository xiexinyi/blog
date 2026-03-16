import type { GetStaticProps } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";

type Props = {
  sections: Array<{ slug: string; title: string; author?: string | null }>;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { loadCollection, getGrandpaSectionDisplayTitle, getGrandpaSectionMeta } = await import(
    "@/lib/content/fs"
  );
  const sectionSlugs = Array.from(
    new Set(loadCollection("grandpa").map((p) => p.slug.split("/")[0]).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const sections = sectionSlugs.map((slug) => ({
    slug,
    title: getGrandpaSectionDisplayTitle(slug),
    author: getGrandpaSectionMeta(slug)?.author ?? null
  }));
  return { props: { sections } };
};

export default function GrandpaIndexPage({ sections }: Props) {
  return (
    <SiteLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">爷爷的文章</h2>
          <p className="text-sm text-slate-600">
            板块来自 `content/grandpa/&lt;板块名&gt;/`。
          </p>
        </header>

        <ul className="space-y-3">
          {sections.map((s) => (
            <li
              key={s.slug}
              className="group relative overflow-hidden rounded-xl border border-emerald-900/10 bg-white/60 p-4 shadow-sm transition hover:border-emerald-900/15 hover:bg-white/80"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-400/30 via-cyan-300/15 to-blue-400/25" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-transparent to-transparent" />
              </div>
              <Link
                href={`/grandpa/${encodeURIComponent(s.slug)}`}
                className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              >
                <span className="sr-only">{s.title}</span>
              </Link>
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium tracking-tight">{s.title}</div>
                    {s.author ? (
                      <div className="mt-1 text-sm text-slate-600">作者：{s.author}</div>
                    ) : null}
                  </div>
                  <div className="mt-0.5 text-slate-400 transition group-hover:text-slate-700">→</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SiteLayout>
  );
}

