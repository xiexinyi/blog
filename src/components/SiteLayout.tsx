import Link from "next/link";
import { PropsWithChildren } from "react";

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            <Link href="/">Xinyi</Link>
          </h1>
          <p className="text-sm text-zinc-400">记录、创作、分享。内容来自 Obsidian。</p>
        </div>
        <nav className="flex gap-4 text-sm text-zinc-300">
          <Link href="/" className="hover:text-white">
            首页
          </Link>
          <Link href="/blog" className="hover:text-white">
            博客
          </Link>
          <Link href="/grandpa" className="hover:text-white">
            爷爷的文章
          </Link>
          <Link href="/projects" className="hover:text-white">
            项目
          </Link>
          <Link href="/about" className="hover:text-white">
            关于
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} Xinyi. All rights reserved.</p>
      </footer>
    </div>
  );
}

