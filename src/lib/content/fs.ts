import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { format } from "date-fns";
import { ContentItem, BaseFrontmatter, ContentType } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function assertWithinContentRoot(p: string) {
  const normalized = path.normalize(p);
  if (!normalized.startsWith(CONTENT_ROOT)) {
    throw new Error("Invalid content path");
  }
}

function listMarkdownFiles(dir: string): string[] {
  assertWithinContentRoot(dir);
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listMarkdownFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(full);
  }
  return files;
}

function slugFromFilename(filePath: string) {
  return path.basename(filePath).replace(/\.md$/i, "");
}

function normalizeFrontmatter<T extends BaseFrontmatter>(fm: T): T {
  const normalized: any = { ...fm };
  if (normalized.date instanceof Date) {
    normalized.date = format(normalized.date, "yyyy-MM-dd");
  } else if (typeof normalized.date === "string") {
    // keep as-is
  } else if (normalized.date != null) {
    normalized.date = String(normalized.date);
  }
  return normalized as T;
}

export function loadCollection<T extends BaseFrontmatter = BaseFrontmatter>(
  type: ContentType
): ContentItem<T>[] {
  const dir = path.join(CONTENT_ROOT, `${type === "page" ? "pages" : `${type}s`}`);
  const files = listMarkdownFiles(dir);

  const items: ContentItem<T>[] = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const frontmatter = normalizeFrontmatter(parsed.data as T);

    const slug = (frontmatter.slug && String(frontmatter.slug)) || slugFromFilename(file);
    return {
      frontmatter,
      slug,
      body: parsed.content
    };
  });

  return items
    .filter((x) => x.frontmatter.type === type)
    .filter((x) => !x.frontmatter.draft)
    .sort((a, b) => (b.frontmatter.date || "").localeCompare(a.frontmatter.date || ""));
}

export function loadBySlug<T extends BaseFrontmatter = BaseFrontmatter>(
  type: ContentType,
  slug: string
): ContentItem<T> | null {
  const all = loadCollection<T>(type);
  const item = all.find((x) => x.slug === slug);
  return item ?? null;
}

