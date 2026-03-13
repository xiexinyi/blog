import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { SiteLayout } from "@/components/SiteLayout";

type Props = {
  title: string;
  date?: string;
  html: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { loadCollection } = await import("@/lib/content/fs");
  const paths = loadCollection("grandpa")
    .map((p) => {
      const [section, ...rest] = p.slug.split("/");
      const slug = rest.join("/");
      if (!section || !slug) return null;
      return { params: { section, slug } };
    })
    .filter(Boolean) as Array<{ params: { section: string; slug: string } }>;

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const { loadBySlug } = await import("@/lib/content/fs");
  const { markdownToHtml } = await import("@/lib/content/markdown");

  const section = String(ctx.params?.section || "");
  const slug = String(ctx.params?.slug || "");
  const post = loadBySlug("grandpa", `${section}/${slug}`);
  if (!post) return { notFound: true };

  const html = await markdownToHtml(post.body);

  return {
    props: {
      title: post.frontmatter.title,
      date: post.frontmatter.date,
      html
    }
  };
};

export default function GrandpaArticlePage({ title, date, html }: Props) {
  return (
    <SiteLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="prose prose-invert max-w-none">
        <header className="not-prose mb-8 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <div className="text-sm text-zinc-400">{date}</div>
        </header>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </SiteLayout>
  );
}

