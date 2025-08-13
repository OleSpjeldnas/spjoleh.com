#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

function usage() {
  console.log('Usage: node scripts/new-article.mjs "Title here" [slug]');
  process.exit(1);
}

const [, , titleArg, slugArg] = process.argv;
if (!titleArg) usage();

const title = titleArg.trim();
const today = new Date();
const datePart = today.toISOString().slice(0, 10); // YYYY-MM-DD
const slugBase = (slugArg || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).slice(0, 80);
const filename = `${datePart}-${slugBase}`;

// Ensure image folder under public/articles/<filename>/
const publicDir = join(process.cwd(), 'public', 'articles', filename);
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Create markdown in src/content/articles/
const contentDir = join(process.cwd(), 'src', 'content', 'articles');
const mdPath = join(contentDir, `${filename}.md`);
if (existsSync(mdPath)) {
  console.error(`Refusing to overwrite existing file: ${mdPath}`);
  process.exit(2);
}

const md = `---
title: ${title}
published: ${datePart}
summary: 
hero: ${filename}/hero.jpg
---

## Section title

Start writing here.

`;

writeFileSync(mdPath, md, 'utf8');

console.log('Created:');
console.log(' -', mdPath);
console.log(' -', publicDir, '(for images, e.g., hero.jpg)');


