import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { SiteLayout } from "@/components/SiteLayout";

type Props = {
  title: string;
  link?: string;
  html: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { loadCollection } = await import("@/lib/content/fs");
  const paths = loadCollection("project").map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const { loadBySlug } = await import("@/lib/content/fs");
  const { markdownToHtml } = await import("@/lib/content/markdown");
  const slug = String(ctx.params?.slug || "");
  const project = loadBySlug("project", slug);
  if (!project) return { notFound: true };

  const html = await markdownToHtml(project.body);

  return {
    props: {
      title: project.frontmatter.title,
      link: project.frontmatter.link,
      html
    }
  };
};

export default function ProjectPage({ title, link, html }: Props) {
  return (
    <SiteLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="prose prose-slate max-w-none">
        <header className="not-prose mb-8 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-emerald-700 hover:text-emerald-800"
            >
              {link}
            </a>
          ) : null}
        </header>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </SiteLayout>
  );
}

