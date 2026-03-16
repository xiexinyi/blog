import Link from "next/link";
import { PropsWithChildren } from "react";

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="page-bg">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
        <div className="rounded-3xl border border-emerald-950/10 bg-white/55 shadow-[0_1px_0_rgba(255,255,255,0.6),0_20px_60px_rgba(2,6,23,0.06)] backdrop-blur">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              <Link href="/" className="hover:text-slate-950">
                Xinyi
              </Link>
            </h1>
            <p className="text-sm text-slate-600">记录、创作、分享。内容来自 Obsidian。</p>
          </div>

          <nav className="flex flex-wrap gap-1 rounded-full border border-emerald-800/10 bg-white/60 p-1 text-sm text-slate-700 backdrop-blur">
            <Link href="/" className="rounded-full px-3 py-1.5 hover:bg-emerald-500/10 hover:text-slate-950">
              首页
            </Link>
            <Link
              href="/blog"
              className="rounded-full px-3 py-1.5 hover:bg-emerald-500/10 hover:text-slate-950"
            >
              博客
            </Link>
            <Link
              href="/grandpa"
              className="rounded-full px-3 py-1.5 hover:bg-emerald-500/10 hover:text-slate-950"
            >
              爷爷的文章
            </Link>
            <Link
              href="/projects"
              className="rounded-full px-3 py-1.5 hover:bg-emerald-500/10 hover:text-slate-950"
            >
              项目
            </Link>
            <Link
              href="/about"
              className="rounded-full px-3 py-1.5 hover:bg-emerald-500/10 hover:text-slate-950"
            >
              关于
            </Link>
          </nav>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="mt-12 border-t border-emerald-900/10 pt-6 text-sm text-slate-600">
              <p>© {new Date().getFullYear()} Xinyi. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

