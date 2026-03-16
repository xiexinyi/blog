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
          <p className="text-sm text-zinc-400">来自 `content/projects/`。</p>
        </header>

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
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-20 mt-2 block text-sm text-sky-400 hover:text-sky-300"
                >
                  外部链接 →
                </a>
              ) : null}
              {p.tags?.length ? (
                <div className="relative z-20 mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
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
            </li>
          ))}
        </ul>
      </div>
    </SiteLayout>
  );
}

