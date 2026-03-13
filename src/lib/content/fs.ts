import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { format } from "date-fns";
import { ContentItem, BaseFrontmatter, ContentType } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const GRANDPA_SECTIONS_META = path.join(CONTENT_ROOT, "grandpa", "sections.json");

type GrandpaSectionMeta = {
  folder: string; // actual folder name under content/grandpa/
  slug: string; // URL-safe section slug (English)
  title: string; // display title (e.g. Chinese)
};

let grandpaSectionCache:
  | { byFolder: Map<string, GrandpaSectionMeta>; bySlug: Map<string, GrandpaSectionMeta> }
  | null = null;

function loadGrandpaSectionMeta() {
  if (grandpaSectionCache) return grandpaSectionCache;

  const byFolder = new Map<string, GrandpaSectionMeta>();
  const bySlug = new Map<string, GrandpaSectionMeta>();

  if (fs.existsSync(GRANDPA_SECTIONS_META)) {
    const raw = fs.readFileSync(GRANDPA_SECTIONS_META, "utf8");
    const parsed = JSON.parse(raw) as GrandpaSectionMeta[];
    for (const m of parsed) {
      if (!m?.folder || !m?.slug || !m?.title) continue;
      byFolder.set(m.folder, m);
      bySlug.set(m.slug, m);
    }
  }

  grandpaSectionCache = { byFolder, bySlug };
  return grandpaSectionCache;
}

export function getGrandpaSectionDisplayTitle(sectionSlug: string) {
  const meta = loadGrandpaSectionMeta().bySlug.get(sectionSlug);
  return meta?.title ?? sectionSlug;
}

export function listGrandpaSections() {
  const meta = loadGrandpaSectionMeta();
  return Array.from(meta.bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

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

function slugFromRelativePath(relativePath: string) {
  return relativePath.replace(/\.md$/i, "").split(path.sep).join("/");
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
  const folder =
    type === "post"
      ? "blog"
      : type === "page"
        ? "pages"
        : type === "project"
          ? "projects"
          : type === "grandpa"
            ? "grandpa"
            : "";
  const dir = path.join(CONTENT_ROOT, folder);
  const files = listMarkdownFiles(dir);

  const items: ContentItem<T>[] = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const frontmatter = normalizeFrontmatter(parsed.data as T);

    const slug =
      type === "grandpa"
        ? (() => {
            const rel = slugFromRelativePath(path.relative(dir, file));
            const [sectionFolder, ...rest] = rel.split("/");
            if (!sectionFolder) return rel;
            const mapped = loadGrandpaSectionMeta().byFolder.get(sectionFolder)?.slug ?? sectionFolder;
            return [mapped, ...rest].join("/");
          })()
        : (frontmatter.slug && String(frontmatter.slug)) || slugFromFilename(file);
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

