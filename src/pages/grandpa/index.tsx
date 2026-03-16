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
          <p className="text-sm text-zinc-400">
            板块来自 `content/grandpa/&lt;板块名&gt;/`。
          </p>
        </header>

        <ul className="space-y-3">
          {sections.map((s) => (
            <li key={s.slug} className="rounded-lg border border-zinc-800 p-4">
              <Link href={`/grandpa/${encodeURIComponent(s.slug)}`} className="hover:underline">
                <div className="text-base font-medium">{s.title}</div>
              </Link>
              {s.author ? <div className="mt-1 text-sm text-zinc-400">作者：{s.author}</div> : null}
              <div className="mt-1 text-sm text-zinc-400">点击进入目录</div>
            </li>
          ))}
        </ul>
      </div>
    </SiteLayout>
  );
}

