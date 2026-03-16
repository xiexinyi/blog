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
  const paths = loadCollection("post").map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const { loadBySlug } = await import("@/lib/content/fs");
  const { markdownToHtml } = await import("@/lib/content/markdown");
  const slug = String(ctx.params?.slug || "");
  const post = loadBySlug("post", slug);
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

export default function BlogPostPage({ title, date, html }: Props) {
  return (
    <SiteLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="prose prose-slate max-w-none">
        <header className="not-prose mb-8 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <div className="text-sm text-slate-600">{date}</div>
        </header>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </SiteLayout>
  );
}

