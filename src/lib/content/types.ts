export type ContentType = "post" | "page" | "project" | "grandpa";

export type BaseFrontmatter = {
  type: ContentType;
  title: string;
  slug?: string;
  date?: string;
  order?: number;
  tags?: string[];
  draft?: boolean;
  link?: string;
};

export type ContentItem<T extends BaseFrontmatter = BaseFrontmatter> = {
  frontmatter: T;
  slug: string;
  body: string;
};

