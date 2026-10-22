import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import './tools/render-site.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, "dist");
const assets = join(dist, "assets");

if (!dist.startsWith(resolve(root) + sep) || dist !== join(root, 'dist')) throw Error('Invalid build directory');
await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });

for (const directory of ["blog", "archive", "assets/images/diagrams", "assets/fonts/site", "assets/fonts/manrope"]) {
  await cp(join(root, directory), join(assets, directory), { recursive: true });
}
const publicFiles=['assets/css/editorial.css','assets/css/studio.css','assets/css/theme.css','assets/css/legacy.css','assets/js/legacy.js','assets/js/studio.js','assets/js/academy.js','assets/js/journal.js','assets/js/blog-index.js','assets/js/blog-search.js','assets/fonts/fonts.css','assets/css/home-v2.css','assets/js/home-v2.js','assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js','assets/vendor/lenis.min.js','assets/fonts/OFL.txt','assets/images/teacher-profile-original.png','assets/images/teacher-profile.webp','assets/images/brand-mark-original.png'];
for (const entry of await readdir(join(root,'assets/images/editorial'))) if(entry.endsWith('.webp'))publicFiles.push('assets/images/editorial/'+entry);
for (const entry of await readdir(join(root,'assets/images/legacy'))) publicFiles.push('assets/images/legacy/'+entry);
for (const entry of await readdir(join(root,'assets/images/studio'))) publicFiles.push('assets/images/studio/'+entry);
for (const entry of await readdir(join(root,'assets/images/home'))) publicFiles.push('assets/images/home/'+entry);
for (const entry of await readdir(join(root,'assets/audio/home'))) publicFiles.push('assets/audio/home/'+entry);
for (const file of publicFiles) {await mkdir(dirname(join(assets,file)),{recursive:true});await cp(join(root,file),join(assets,file));}

const rootFiles = await readdir(root, { withFileTypes: true });
for (const entry of rootFiles) {
  if (!entry.isFile()) continue;
  if (!/\.(?:html|txt|xml|webmanifest)$/i.test(entry.name)) continue;
  await cp(join(root, entry.name), join(assets, entry.name));
}

const redirects = {
  aboutme: "about.html", "teaching-concept": "about.html#concept", "teaching-organisation": "gallery.html#orgs", awards: "gallery.html#awards", performance: "gallery.html#performance", "class-potho": "gallery.html#class",
  "flute-class": "flute-course.html", "dizi-class": "dizi-course.html", meditationdrum: "tongue-drum-course.html", drumclass: "tongue-drum-course.html", littledrum: "drum-accessories.html",
  abrsm: "exam-guide.html", ccom: "exam-guide.html#ccom", "music-therapy": "courses.html", instrument: "archive.html", experience: "archive.html", "music-fun": "archive.html",
  myvideo: "videos.html#perform", teach: "videos.html#teach", matserclass: "videos.html#masterclass", score: "scores.html#pop", "tongue-drum-score": "scores.html#drum", "class-socre": "scores.html#dizi",
  "ai-seo-hub": "learning-guide.html"
};
const stub = (to) => `<!doctype html><html lang="zh-Hant-HK"><head><meta charset="utf-8"><title>頁面已搬遷</title><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><p>此頁已搬到 <a href="${to}">新位置</a>。</p></body></html>`;
for (const [from, to] of Object.entries(redirects)) await writeFile(join(assets, from + ".html"), stub(to), "utf8");
const oldPosts = JSON.parse(await readFile(join(root, "content/legacy-posts.json"), "utf8")).map((p) => p.slug);
for (const slug of oldPosts) await writeFile(join(assets, "blog", slug + ".html"), stub("../archive/" + slug + ".html"), "utf8");
const emptyPosts = { "2026": "flute-course.html", "abrsm-flute-exam-hong-kong-guide": "exam-guide.html", "adult-beginner-flute-lessons-hong-kong": "adult-beginner.html", "flute-lesson-price-hong-kong-2025": "flute-course.html", "flute-no-sound-beginner-embouchure-hong-kong": "flute-course.html" };
for (const [slug, to] of Object.entries(emptyPosts)) await writeFile(join(assets, "blog", slug + ".html"), stub("../" + to), "utf8");
{
  const fontsCss = (await readFile(join(root, "assets/fonts/fonts.css"), "utf8")).replaceAll("url(./", "url(assets/fonts/");
  const homeCss = await readFile(join(root, "assets/css/home-v2.css"), "utf8");
  const page = (await readFile(join(assets, "home-v2.html"), "utf8"))
    .replace('<link rel="stylesheet" href="assets/fonts/fonts.css">', () => `<style>${fontsCss}</style>`)
    .replace('<link rel="stylesheet" href="assets/css/home-v2.css">', () => `<style>${homeCss}</style>`);
  await writeFile(join(assets, "home-v2.html"), page, "utf8");
}
await writeFile(join(assets, ".nojekyll"), "", "utf8");
const covered = new Set(await readFile(join(root, "assets/fonts/site/coverage.txt"), "utf8"));
const missing = new Set();
for (const file of await readdir(assets, { recursive: true })) {
  if (!/\.(?:html|js)$/.test(file)) continue;
  for (const ch of await readFile(join(assets, file), "utf8")) if (ch.codePointAt(0) > 0x2e7f && !covered.has(ch)) missing.add(ch);
}
if (missing.size) console.warn(`字型未收錄 ${missing.size} 字（${[...missing].join("")}），請重跑 python3 tools/build_fonts.py <NotoSerifTC[wght].ttf>`);
console.log(`Built ${dist}`);
