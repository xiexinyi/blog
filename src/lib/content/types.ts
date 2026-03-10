export type ContentType = "post" | "page" | "project";

export type BaseFrontmatter = {
  type: ContentType;
  title: string;
  slug?: string;
  date?: string;
  tags?: string[];
  draft?: boolean;
  link?: string;
};

export type ContentItem<T extends BaseFrontmatter = BaseFrontmatter> = {
  frontmatter: T;
  slug: string;
  body: string;
};

