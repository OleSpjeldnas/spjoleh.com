export const prerender = true;
import { getCollection } from 'astro:content';
const site = 'https://example.com';

export async function GET() {
  const posts = await getCollection('articles');
  const updated = new Date().toISOString();
  const entries = posts
    .sort((a,b) => a.data.published < b.data.published ? 1 : -1)
    .map((p) => `\n  <entry>\n    <title>${escapeXml(p.data.title)}</title>\n    <id>${site}/articles/${p.slug}</id>\n    <link href="${site}/articles/${p.slug}"/>\n    <updated>${new Date(p.data.published).toISOString()}</updated>\n    ${p.data.summary ? `<summary>${escapeXml(p.data.summary)}</summary>` : ''}\n  </entry>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n  <title>Articles</title>\n  <id>${site}/articles</id>\n  <link href="${site}/articles"/>\n  <updated>${updated}</updated>${entries}\n</feed>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


