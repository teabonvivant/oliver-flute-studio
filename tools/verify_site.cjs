#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'dist', 'assets');
const revisedDate = '2026-09-24';
const newPostsDate = '2026-09-22';
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
  const source = JSON.parse(fs.readFileSync(path.join(root, 'content', 'legacy-curated.json'), 'utf8'));
  const legacyBySlug = new Map(source.map((post) => [path.basename(post.url, '.html'), post]));
  const filenames = listHtml(path.join(site, 'blog'));
  assert.equal(filenames.length, 200, `Expected 200 article pages, found ${filenames.length}`);
  assert.equal(posts.length, 200, `Expected 200 index records, found ${posts.length}`);
  assert.equal(legacyBySlug.size, 100, 'Expected 100 source-dated legacy records');

  const repeatedHeadings = new Map();
  let revisedArticles = 0;
  let newArticles = 0;
  for (const filename of filenames) {
    const slug = path.basename(filename, '.html');
    const file = `blog/${filename}`;
    const html = read(file);
    const post = posts.find((item) => item.slug === slug);
    assert(post, `${file} is not in the blog index`);
    const schema = articleSchema(html, file);
    assert.equal(schema['@type'], 'Article', `${file} schema type mismatch`);
    assert.equal(schema.headline, post.title, `${file} schema headline mismatch`);
    assert.equal(schema.author?.['@type'], 'Organization', `${file} must use an organization byline`);
    assert.equal(schema.author?.name, brand, `${file} author identity mismatch`);
    assert.equal(schema.publisher?.['@type'], 'Organization', `${file} publisher type mismatch`);
    assert.equal(schema.publisher?.name, brand, `${file} publisher identity mismatch`);
    assert.equal(schema.dateModified, revisedDate, `${file} schema revision date mismatch`);
    assert.equal((html.match(new RegExp(`${brand} · `, 'g')) || []).length, 1, `${file} visible byline should identify the school once`);
    assertHas(html, /張老師音樂學院 · (?:發表於|修訂於) 2026 \/ 09 \/ (?:22|24)/, `${file} visible date`);
    const title = stripTags(firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/, `${file} H1`));
    assert.equal(title, post.title, `${file} H1 title mismatch`);
    const body = firstMatch(html, /<article class="article-body">([\s\S]*?)<\/article>/, `${file} article body`);
    const sectionHeadings = [...body.matchAll(/<h2\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)];
    assert(sectionHeadings.length > 0, `${file} has no body section headings`);
    const toc = firstMatch(html, /<aside class="article-side">([\s\S]*?)<\/aside>/, `${file} table of contents`);
    const legacy = legacyBySlug.get(slug);
    if (legacy) assert.deepEqual(sectionHeadings.map((match) => match[1]), ['focus', 'practice'], `${file} legacy TOC anchor IDs changed`);
    for (const [, id, headingHtml] of sectionHeadings) {
      const heading = stripTags(headingHtml);
      assert(heading.length > 0, `${file} has an empty section heading`);
      const tocEntry = toc.match(new RegExp(`<a href="#${id}">([^<]+)<\\/a>`));
      assert(tocEntry, `${file} table of contents entry for ${id}`);
      assert.equal(stripTags(tocEntry[1]), heading, `${file} table of contents label mismatch for ${id}`);
      if (legacy) {
        const key = `${id}:${heading}`;
        repeatedHeadings.set(key, (repeatedHeadings.get(key) || 0) + 1);
      }
    }
    const illustrations = [...body.matchAll(/<img\b[^>]*>/g)];
    assert.equal(illustrations.length, 2, `${file} should contain one editorial illustration and one diagram`);
    for (const image of illustrations) assertHas(image[0], /\balt="[^"]+"/, `${file} illustration alt text`);

    if (legacy) {
      revisedArticles += 1;
      assert.equal(schema.datePublished, legacy.date, `${file} original publication date mismatch`);
      assertHas(html, /張老師音樂學院 · 修訂於 2026 \/ 09 \/ 24/, `${file} revised visible date`);
    } else {
      newArticles += 1;
      assert.equal(schema.datePublished, newPostsDate, `${file} publication date mismatch`);
      assertHas(html, /張老師音樂學院 · 發表於 2026 \/ 09 \/ 22/, `${file} published visible date`);
    }
  }
  assert.equal(revisedArticles, 100, `Expected 100 revised articles, found ${revisedArticles}`);
  assert.equal(newArticles, 100, `Expected 100 newly published articles, found ${newArticles}`);
  const maxHeadingRepeat = Math.max(...repeatedHeadings.values());
  assert(maxHeadingRepeat <= 2, `Grounded section headings repeat more than twice (max ${maxHeadingRepeat})`);
  return { articlePages: filenames.length, revisedArticles, newArticles, maxGroundedHeadingRepeat: maxHeadingRepeat };
}

function verifyRoutesAndSitemap(htmlFiles) {
  assert.equal(htmlFiles.length, 26, `Expected 26 top-level HTML routes, found ${htmlFiles.length}`);
  const sitemap = read('sitemap.xml');
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  assert.equal(entries.length, htmlFiles.length - 1 + 200, 'Sitemap route count mismatch');
  assert(entries.every((entry) => entry.includes(`<lastmod>${revisedDate}</lastmod>`)), 'Sitemap lastmod values do not match the latest revision date');
  const urls = entries.map((entry) => firstMatch(entry, /<loc>([^<]+)<\/loc>/, 'Sitemap location'));
  assert.equal(new Set(urls).size, urls.length, 'Sitemap contains duplicate URLs');
  assert.equal(urls.filter((url) => url.includes('/blog/')).length, 200, 'Sitemap should list all 200 article pages');
  assertHas(read('robots.txt'), /Sitemap: https:\/\/\S+\/sitemap\.xml/, 'Robots sitemap link');
  return { topLevelRoutes: htmlFiles.length, sitemapRoutes: entries.length, articleSitemapRoutes: 200 };
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
  ]);
  console.log(JSON.stringify({ ok: true, blog, articles, routes, references }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
}
