import type { GetStaticProps } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";

type ProjectItem = {
  slug: string;
  title: string;
  tags?: string[];
  link?: string;
};

type Props = {
  projects: ProjectItem[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { loadCollection } = await import("@/lib/content/fs");
  const projects = loadCollection("project").map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    tags: p.frontmatter.tags,
    link: p.frontmatter.link
  }));
  return { props: { projects } };
};

export default function ProjectsIndexPage({ projects }: Props) {
  return (
    <SiteLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">项目</h2>
          <p className="text-sm text-slate-600">来自 `content/projects/`。</p>
        </header>

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
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-20 mt-3 inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800"
                >
                  外部链接 <span aria-hidden>↗</span>
                </a>
              ) : null}
              {p.tags?.length ? (
                <div className="relative z-20 mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
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
            </li>
          ))}
        </ul>
      </div>
    </SiteLayout>
  );
}

