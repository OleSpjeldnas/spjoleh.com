# brandur.org clone starter (Astro/Tailwind/Shiki)

Build:
- pnpm install
- pnpm build

Dev:
- pnpm dev

Output: dist/ (static HTML/CSS/JS)

Feeds: /articles.atom

Content authoring:

- Write Markdown files under `src/content/articles/*.md` with frontmatter:
  - `title`, `slug`, `published` (YYYY-MM-DD), `location?`, `summary?`, `hero?`
- Place images per-article under `public/articles/<slug>/...`.
  - Example: `public/articles/2024-05-28-two-phase-render/hero.jpg`
  - In frontmatter set `hero: 2024-05-28-two-phase-render/hero.jpg`
  - In Markdown, reference inline images like `![Alt](/articles/2024-05-28-two-phase-render/diagram.png)`

Deploy `dist/` to S3 behind CloudFront with long-cache for hashed assets and short-cache for HTML.
