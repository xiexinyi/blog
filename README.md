# Personal Site (Next.js + Obsidian)

## 本地运行

```bash
npm install
npm run dev
```

## 内容来源（Obsidian 联动）

- 把 Obsidian Vault 里用于网站的内容目录（建议叫 `Website/`）同步到仓库的 `content/`。
- 目录约定：
  - `content/blog/`：博客（Frontmatter `type: post`）
  - `content/pages/`：独立页面（`type: page`）
  - `content/projects/`：项目（`type: project`）

## GitHub Pages 部署

- 工作流在 `.github/workflows/deploy.yml`，会把静态导出产物 `out/` 部署到 GitHub Pages。
- 如果你的仓库名不是 `blog`，请把工作流里 `NEXT_PUBLIC_BASE_PATH` 改成 `/<repo-name>`。