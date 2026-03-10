/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Next.js 静态导出（生成 `out/`），用于 GitHub Pages。
   */
  output: "export",
  images: {
    unoptimized: true
  },
  /**
   * GitHub Pages 的路径通常是 `/<repo-name>`。
   * 这里默认从环境变量读取，避免你每次改 repo 都要改配置文件。
   *
   * - Repo pages: https://username.github.io/<repo-name>  → basePath="/<repo-name>"
   * - User/Org pages: https://username.github.io/         → basePath=""
   */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || ""
};

export default nextConfig;

