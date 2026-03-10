import type { GetStaticProps } from "next";
import Head from "next/head";
import { SiteLayout } from "@/components/SiteLayout";

type Props = {
  title: string;
  html: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { loadBySlug } = await import("@/lib/content/fs");
  const { markdownToHtml } = await import("@/lib/content/markdown");
  const page = loadBySlug("page", "about");
  if (!page) return { notFound: true };

  const html = await markdownToHtml(page.body);

  return {
    props: {
      title: page.frontmatter.title,
      html
    }
  };
};

export default function AboutPage({ title, html }: Props) {
  return (
    <SiteLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="prose prose-invert max-w-none">
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </SiteLayout>
  );
}

