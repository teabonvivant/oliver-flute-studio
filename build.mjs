import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import './tools/render-site.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, "dist");
const assets = join(dist, "assets");

if (!dist.startsWith(resolve(root) + sep) || dist !== join(root, 'dist')) throw Error('Invalid build directory');
await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });

for (const directory of ["blog", "assets/images/diagrams", "assets/fonts/subsets", "assets/fonts/manrope", "assets/fonts/book"]) {
  await cp(join(root, directory), join(assets, directory), { recursive: true });
}
const publicFiles=['assets/css/editorial.css','assets/css/studio.css','assets/js/studio.js','assets/js/academy.js','assets/js/journal.js','assets/js/blog-index.js','assets/fonts/fonts.css','assets/fonts/OFL.txt','assets/images/teacher-profile-original.png','assets/images/brand-mark-original.png'];
for (const entry of await readdir(join(root,'assets/images/editorial'))) if(entry.endsWith('.webp'))publicFiles.push('assets/images/editorial/'+entry);
for (const entry of await readdir(join(root,'assets/images/studio'))) publicFiles.push('assets/images/studio/'+entry);
for (const file of publicFiles) {await mkdir(dirname(join(assets,file)),{recursive:true});await cp(join(root,file),join(assets,file));}

const rootFiles = await readdir(root, { withFileTypes: true });
for (const entry of rootFiles) {
  if (!entry.isFile()) continue;
  if (!/\.(?:html|txt|xml|webmanifest)$/i.test(entry.name)) continue;
  await cp(join(root, entry.name), join(assets, entry.name));
}

const redirects = {
  aboutme: "about.html", "teaching-concept": "about.html", "teaching-organisation": "about.html", awards: "about.html", performance: "about.html", "class-potho": "about.html",
  "flute-class": "flute-course.html", "dizi-class": "dizi-course.html", meditationdrum: "tongue-drum-course.html", drumclass: "tongue-drum-course.html", littledrum: "tongue-drum-course.html",
  abrsm: "exam-guide.html", ccom: "exam-guide.html", "music-therapy": "courses.html", instrument: "blog.html", experience: "blog.html", "music-fun": "blog.html",
  myvideo: "works.html", teach: "works.html", matserclass: "works.html", score: "works.html", "tongue-drum-score": "works.html", "class-socre": "works.html",
  "ai-seo-hub": "learning-guide.html"
};
for (const [from, to] of Object.entries(redirects)) {
  await writeFile(join(assets, from + ".html"), `<!doctype html><html lang="zh-Hant-HK"><head><meta charset="utf-8"><title>頁面已搬遷</title><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><p>此頁已搬到 <a href="${to}">新位置</a>。</p></body></html>`, "utf8");
}
await writeFile(join(assets, ".nojekyll"), "", "utf8");
console.log(`Built ${dist}`);
