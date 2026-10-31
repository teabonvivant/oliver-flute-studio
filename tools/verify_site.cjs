#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'dist', 'assets');
const revisedDate = '2026-10-31';
const brand = '張老師音樂學院';

function read(file) {
  return fs.readFileSync(path.join(site, file), 'utf8');
}

function listHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name);
}

function assertHas(value, pattern, message) {
  assert.match(value, pattern, message);
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function firstMatch(value, pattern, label) {
  const match = value.match(pattern);
  assert(match, `${label} is missing`);
  return match[1];
}

function articleSchema(html, file) {
  const json = firstMatch(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/, `${file} Article JSON-LD`);
  return JSON.parse(json);
}

function localTarget(fromFile, reference) {
  const decoded = decodeURIComponent(reference.replace(/&amp;/g, '&'));
  if (/^(?:https?:|mailto:|tel:|data:|javascript:|blob:|\/\/)/i.test(decoded)) return null;
  const basePath = new URL((process.env.SITE_ORIGIN || 'https://teabonvivant.github.io/oliver-flute-studio').replace(/\/$/, '') + '/').pathname;
  let withoutQuery = decoded.split(/[?#]/, 1)[0];
  if (withoutQuery.startsWith(basePath)) withoutQuery = '/' + withoutQuery.slice(basePath.length);
  if (!withoutQuery) return { file: fromFile, anchor: decoded.startsWith('#') ? decoded.slice(1) : null };
  const joined = withoutQuery.startsWith('/')
    ? path.join(site, withoutQuery.slice(1))
    : path.resolve(path.dirname(fromFile), withoutQuery);
  const normalized = path.resolve(joined);
  assert(normalized === site || normalized.startsWith(site + path.sep), `Reference escapes build output: ${reference}`);
  let target = normalized;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  else if (!path.extname(target)) target = `${target}.html`;
  return { file: target, anchor: decoded.includes('#') ? decoded.split('#').slice(1).join('#') : null };
}

function idsIn(html) {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
}

function verifyReferences(htmlFiles) {
  const missing = [];
  let inspected = 0;
  for (const file of htmlFiles) {
    const absolute = path.join(site, file);
    const html = fs.readFileSync(absolute, 'utf8');
    const sourceRefs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    const ids = idsIn(html);
    for (const reference of sourceRefs) {
      const target = localTarget(absolute, reference);
      if (!target) continue;
      inspected += 1;
      if (!fs.existsSync(target.file)) {
        missing.push(`${file} -> ${reference}`);
        continue;
      }
      if (target.anchor && target.file.endsWith('.html')) {
        const targetIds = target.file === absolute ? ids : idsIn(fs.readFileSync(target.file, 'utf8'));
        if (!targetIds.has(target.anchor)) missing.push(`${file} -> ${reference} (anchor missing)`);
      }
    }
  }
  const cssFiles = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && entry.name.endsWith('.css')) cssFiles.push(absolute);
    }
  };
  walk(site);
  for (const file of cssFiles) {
    const css = fs.readFileSync(file, 'utf8');
    for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const target = localTarget(file, match[1].trim());
      if (!target) continue;
      inspected += 1;
      if (!fs.existsSync(target.file)) missing.push(`${path.relative(site, file)} -> ${match[1]}`);
    }
  }
  assert.equal(missing.length, 0, `Broken local references:\n${missing.slice(0, 30).join('\n')}`);
  return { inspectedLocalReferences: inspected, cssFiles: cssFiles.length };
}

function verifyBlogIndex(posts) {
  const html = read('blog.html');
  const js = read('assets/js/journal.js');
  assertHas(html, /<h1\b/, 'Blog page H1');
  assertHas(html, /先從你的學習需要開始/, 'Audience entry paths');
  assertHas(html, /成人入門[\s\S]*?家長陪練[\s\S]*?考級準備/, 'Adult, parent, and exam entry links');
  assertHas(html, /id="blogSearch"[^>]*type="search"/, 'Blog search');
  assertHas(html, /data-clear-blog-search/, 'Clear search action');
  assertHas(html, /data-blog-filters/, 'Topic filters');
  assertHas(html, /data-blog-sort/, 'Sort control');
  assertHas(html, /data-blog-count[^>]*role="status"/, 'Live result count');
  assertHas(html, /data-pagination/, 'Pagination');
  for (const hook of ['data-blog-list', 'data-empty', 'data-reset-search']) assertHas(html, new RegExp(hook), `Blog interaction ${hook}`);
  for (const hook of ['data-filter', 'data-blog-sort', 'data-pagination']) assertHas(js, new RegExp(hook), `Journal script ${hook}`);
  assertHas(js, /<h2><a href=/, 'Dynamic card heading level');
  const filters = [...html.matchAll(/<button\b[^>]*data-filter="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)];
  const expectedCategories = [...new Set(posts.map((post) => post.category))];
  assert.equal(filters.length, expectedCategories.length + 1, 'Topic filter count differs from article categories');
  assert.equal(filters[0][1], '全部', 'All-topics filter should be first');
  const filterCounts = new Map(filters.map(([, category, body]) => [category, Number(firstMatch(body, /<span>(\d+)<\/span>/, `${category} filter count`))]));
  assert.equal(filterCounts.get('全部'), posts.length, 'All-topics count does not match articles');
  for (const category of expectedCategories) {
    const expected = posts.filter((post) => post.category === category).length;
    assert.equal(filterCounts.get(category), expected, `${category} filter count mismatch`);
  }
  for (const sort of ['recommended', 'latest', 'category']) assertHas(html, new RegExp(`<option value="${sort}"`), `${sort} sort option`);
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
  let previous = 0;
  for (const level of levels) {
    assert(level <= previous + 1, `Blog heading hierarchy skips from H${previous} to H${level}`);
    previous = level;
  }
  return { articleCount: posts.length, topicCount: expectedCategories.length, filterCount: filters.length, headingSequence: [...new Set(levels)].map((level) => `H${level}`).join(' → ') };
}

function verifyArticles(posts) {
  const blogFiles = listHtml(path.join(site, 'blog'));
  const stubs = blogFiles.filter((file) => read(`blog/${file}`).includes('此頁已併入'));
  const pagesOnly = blogFiles.filter((file) => !read(`blog/${file}`).includes('頁面已搬遷'));
  assert.equal(stubs.length, 200, `Expected 200 old-URL redirects, found ${stubs.length}`);
  assert.equal(pagesOnly.length, 88, `Expected 88 article pages, found ${pagesOnly.length}`);
  assert.equal(posts.length, 88, `Expected 88 index records, found ${posts.length}`);
  for (const file of stubs) {
    const html = read(`blog/${file}`);
    const to = firstMatch(html, /url=([^"]+)"/, `blog/${file} refresh target`);
    const [target, anchor] = to.split('#');
    assert(anchor, `blog/${file} should jump to a section`);
    assertHas(read(`blog/${target}`), new RegExp(`<h2 id="${anchor}"`), `blog/${file} anchor ${anchor}`);
    assertHas(html, new RegExp(`canonical" href="https?://[^"]+/blog/${target}"`), `blog/${file} canonical`);
  }
  let notes = 0;
  for (const filename of pagesOnly) {
    const slug = path.basename(filename, '.html');
    const file = `blog/${filename}`;
    const html = read(file);
    const post = posts.find((item) => item.slug === slug);
    assert(post, `${file} is not in the blog index`);
    assert(!/待核實|編輯備註/.test(html), `${file} leaks editorial notes`);
    if (post.category === '舊站手記') continue;
    notes += 1;
    const schema = articleSchema(html, file);
    assert.equal(schema['@type'], 'Article', `${file} schema type mismatch`);
    assert.equal(schema.headline, post.title, `${file} schema headline mismatch`);
    assert.equal(schema.author?.name, brand, `${file} author identity mismatch`);
    assert.equal(schema.publisher?.name, brand, `${file} publisher identity mismatch`);
    assert.equal(schema.dateModified, revisedDate, `${file} schema revision date mismatch`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(schema.datePublished), `${file} publication date`);
    const faq = JSON.parse(firstMatch(html, /<script type="application\/ld\+json">(\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?)<\/script>/, `${file} FAQ schema`));
    assert(faq.mainEntity.length >= 3 && faq.mainEntity.every((q) => q.name && q.acceptedAnswer.text), `${file} FAQ entries`);
    const title = stripTags(firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/, `${file} H1`));
    assert.equal(title, post.title, `${file} H1 title mismatch`);
    const body = firstMatch(html, /<article class="article-body">([\s\S]*?)<\/article>/, `${file} article body`);
    const sectionHeadings = [...body.matchAll(/<h2\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)];
    assert(sectionHeadings.length >= 3, `${file} has too few sections`);
    const toc = firstMatch(html, /<aside class="article-side">([\s\S]*?)<\/aside>/, `${file} table of contents`);
    for (const [, id, headingHtml] of sectionHeadings) {
      const tocEntry = toc.match(new RegExp(`<a href="#${id}">([^<]+)<\\/a>`));
      assert(tocEntry, `${file} table of contents entry for ${id}`);
      assert.equal(stripTags(tocEntry[1]), stripTags(headingHtml), `${file} table of contents label mismatch for ${id}`);
    }
    assert.equal(new Set(sectionHeadings.map((m) => m[1])).size, sectionHeadings.length, `${file} duplicate anchors`);
    for (const image of body.matchAll(/<img\b[^>]*>/g)) assertHas(image[0], /\balt="[^"]+"/, `${file} illustration alt text`);
  }
  assert.equal(notes, 68, `Expected 68 merged articles, found ${notes}`);
  return { articlePages: pagesOnly.length, mergedArticles: notes, redirects: stubs.length };
}

function verifyRoutesAndSitemap(allHtml) {
  const htmlFiles = allHtml.filter((file) => file !== 'home-v2.html');
  assert.equal(htmlFiles.length, 31, `Expected 31 top-level HTML routes, found ${htmlFiles.length}`);
  const sitemap = read('sitemap.xml');
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  assert.equal(entries.length, htmlFiles.length - 1 + 88, 'Sitemap route count mismatch');
  assert(entries.every((entry) => entry.includes(`<lastmod>${revisedDate}</lastmod>`)), 'Sitemap lastmod values do not match the latest revision date');
  const urls = entries.map((entry) => firstMatch(entry, /<loc>([^<]+)<\/loc>/, 'Sitemap location'));
  assert.equal(new Set(urls).size, urls.length, 'Sitemap contains duplicate URLs');
  assert.equal(urls.filter((url) => url.includes('/blog/')).length, 88, 'Sitemap should list the 68 merged articles and 20 old-site posts');
  assert.equal(urls.filter((url) => url.includes('/archive/')).length, 0, 'Archive stubs stay out of the sitemap');
  assertHas(read('robots.txt'), /Sitemap: https:\/\/\S+\/sitemap\.xml/, 'Robots sitemap link');
  return { topLevelRoutes: htmlFiles.length, sitemapRoutes: entries.length, articleSitemapRoutes: 88 };
}

function main() {
  assert(fs.existsSync(site), 'Build output is missing. Run `node build.mjs` first.');
  const htmlFiles = listHtml(site).filter((file) => !read(file).includes('http-equiv="refresh"'));
  const indexSource = read('assets/js/blog-index.js');
  const posts = JSON.parse(firstMatch(indexSource, /^window\.BLOG_POSTS=([\s\S]*);\s*$/m, 'Blog article index'));
  const blog = verifyBlogIndex(posts);
  const articles = verifyArticles(posts);
  const routes = verifyRoutesAndSitemap(htmlFiles);
  const references = verifyReferences([
    ...htmlFiles,
    ...listHtml(path.join(site, 'blog')).map((file) => `blog/${file}`),
    ...listHtml(path.join(site, 'archive')).map((file) => `archive/${file}`),
  ]);
  console.log(JSON.stringify({ ok: true, blog, articles, routes, references }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
}
