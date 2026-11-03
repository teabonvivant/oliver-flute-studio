import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "Googlebot", "DuckAssistBot", "Amazonbot", "Meta-ExternalAgent", "CCBot"];
const COURSES = [
  ["flute-course.html", "長笛課程", "長笛"],
  ["dizi-course.html", "笛子課程", "笛子"],
  ["xiao-course.html", "洞簫課程", "洞簫"],
  ["tongue-drum-course.html", "空靈鼓課程", "空靈鼓"],
];
const LOCATIONS = [
  { "@type": "Place", name: "張老師音樂頻道（屯門）", address: { "@type": "PostalAddress", streetAddress: "99 COMMONS 大廈（建安／青雲輕鐵站旁）", addressLocality: "屯門", addressRegion: "新界", addressCountry: "HK" } },
  { "@type": "Place", name: "空靈鼓課程（佐敦）", address: { "@type": "PostalAddress", streetAddress: "彌敦道 229 號周生生大廈 12/F", addressLocality: "佐敦", addressRegion: "九龍", addressCountry: "HK" } },
];

const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<br\s*\/?>/g, "\n").replace(/<\/(p|h[1-6]|li|summary|div|section|a)>/g, "$&\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
const ldTag = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const meta = (html, re) => (html.match(re) || [])[1] || "";

export async function seoPost({ assets, origin, oldUrls }) {
  const files = (await readdir(assets, { recursive: true })).filter((f) => f.endsWith(".html") && !f.startsWith("hero-options"));
  const redirects = [];
  const pageInfo = {};
  const ghOrigin = "https://teabonvivant.github.io/oliver-flute-studio";
  const ghBase = "/oliver-flute-studio";
  const basePath = new URL(origin + "/").pathname.replace(/\/$/, "");
  // 源碼以 GitHub Pages 網址／子路徑撰寫；非 html 的文字檔（sitemap、llms、webmanifest）及根路徑寫法也要換成目標網域
  for (const f of await readdir(assets, { recursive: true })) {
    if (!/\.(?:html|txt|xml|webmanifest)$/.test(f) || f.startsWith("hero-options")) continue;
    const p = join(assets, f);
    const src = await readFile(p, "utf8");
    let out = src.replaceAll(ghOrigin, origin);
    if (basePath !== ghBase) out = out.replaceAll(ghBase + "/", basePath + "/");
    if (out !== src) await writeFile(p, out, "utf8");
  }

  for (const f of files) {
    const p = join(assets, f);
    let h = await readFile(p, "utf8");
    if (h.includes(ghOrigin)) h = h.replaceAll(ghOrigin, origin);
    const refresh = h.match(/http-equiv="refresh" content="0; url=([^"]+)"/);
    if (refresh) {
      const target = new URL(refresh[1], `${origin}/${f}`);
      const canon = target.origin + target.pathname;
      h = h.replace(/<meta name="robots" content="noindex">/, "").replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canon}">`);
      await writeFile(p, h, "utf8");
      redirects.push([f.replace(/\.html$/, ""), target.pathname.replace(new URL(origin + "/").pathname, "/")]);
      continue;
    }
    const canonical = meta(h, /<link rel="canonical" href="([^"]+)"/);
    const title = meta(h, /<title>([^<]*)<\/title>/);
    const desc = meta(h, /<meta name="description" content="([^"]*)"/);
    const image = meta(h, /<meta property="og:image" content="([^"]*)"/);
    pageInfo[f] = { canonical, title, desc, h };
    if (f === "404.html") { await writeFile(p, h, "utf8"); continue; }
    let add = "";
    if (canonical && !h.includes("hreflang")) add += `<link rel="alternate" hreflang="zh-HK" href="${canonical}"><link rel="alternate" hreflang="x-default" href="${canonical}">`;
    if (canonical && !h.includes('property="og:url"')) add += `<meta property="og:url" content="${canonical}">`;
    if (image && !h.includes("twitter:image")) add += `<meta name="twitter:image" content="${image}">`;
    if (!h.includes('property="og:site_name"')) add += `<meta property="og:site_name" content="張老師音樂頻道">`;
    if (f === "index.html") {
      h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (m, j) => {
        const o = JSON.parse(j);
        o["@id"] = `${origin}/#org`;
        o.location = LOCATIONS;
        o.availableLanguage = ["yue", "zh-Hant", "en"];
        o.hasOfferCatalog = { "@type": "OfferCatalog", name: "音樂課程", itemListElement: COURSES.map(([file, name, inst]) => ({ "@type": "Course", name, url: `${origin}/${file}`, description: `香港${inst}課程，由張家詠老師任教。`, provider: { "@id": `${origin}/#org` } })) };
        o.founder = { ...o.founder, "@id": `${origin}/about.html#person`, url: `${origin}/about.html` };
        return ldTag(o);
      });
      add += ldTag({ "@context": "https://schema.org", "@type": "WebSite", name: "張老師音樂頻道", alternateName: ["Oliver's Music Channel", "Oliver Flute"], url: `${origin}/`, inLanguage: "zh-Hant-HK", publisher: { "@id": `${origin}/#org` } });
    } else if (!h.includes("ld+json")) {
      const url = canonical;
      const crumb = f === "index.html" ? null : { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "張老師音樂頻道", item: `${origin}/` }, { "@type": "ListItem", position: 2, name: title.split("｜")[0], item: url }] };
      const course = COURSES.find((c) => c[0] === f);
      let main;
      if (course) main = { "@context": "https://schema.org", "@type": "Course", name: course[1], description: desc, url, inLanguage: "zh-Hant-HK", provider: { "@type": "EducationalOrganization", name: "張老師音樂頻道", url: `${origin}/` }, instructor: { "@type": "Person", name: "張家詠", alternateName: "Oliver Cheung" }, about: course[2] };
      else if (f === "about.html") main = { "@context": "https://schema.org", "@type": "AboutPage", url, name: title, description: desc, mainEntity: { "@type": "Person", "@id": `${origin}/about.html#person`, name: "張家詠", alternateName: "Oliver Cheung", jobTitle: "音樂導師", knowsAbout: ["長笛", "竹笛", "洞簫", "空靈鼓"], worksFor: { "@id": `${origin}/#org` }, telephone: "+852 9809 6351" } };
      else if (f === "contact.html") main = { "@context": "https://schema.org", "@type": "ContactPage", url, name: title, description: desc, about: { "@id": `${origin}/#org` } };
      else if (f === "faq.html") {
        const qa = [...h.matchAll(/<summary>([^<]*)<\/summary><div><p>([^<]*)<\/p>/g)].map((m) => ({ "@type": "Question", name: m[1], acceptedAnswer: { "@type": "Answer", text: m[2] } }));
        main = { "@context": "https://schema.org", "@type": "FAQPage", url, mainEntity: qa };
      } else main = { "@context": "https://schema.org", "@type": "WebPage", url, name: title, description: desc, inLanguage: "zh-Hant-HK", isPartOf: { "@type": "WebSite", url: `${origin}/` } };
      add += ldTag(main) + (crumb ? ldTag(crumb) : "");
    }
    if (add) h = h.replace("</head>", add + "</head>");
    await writeFile(p, h, "utf8");
  }

  const bots = AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\n`).join("\n");
  await writeFile(join(assets, "robots.txt"), `User-agent: *\nAllow: /\n\n${bots}\nSitemap: ${origin}/sitemap.xml\n`, "utf8");

  const keyPages = ["index.html", "about.html", "courses.html", ...COURSES.map((c) => c[0]), "adult-beginner.html", "parents.html", "exam-guide.html", "faq.html", "contact.html"];
  const llms = await readFile(join(assets, "llms.txt"), "utf8");
  const summary = `> 張老師音樂頻道由張家詠（Oliver Cheung）老師創辦，在香港教授長笛、笛子、洞簫及空靈鼓，成人與兒童皆可學；屯門（99 COMMONS 大廈，建安／青雲輕鐵站旁）上課，空靈鼓課程另設佐敦（彌敦道 229 號周生生大廈 12/F）。長笛及笛子課不設上門及試堂。查詢及報名：WhatsApp 9809 6351（${origin}/contact.html）。學費一對一課程以查詢報價為準；空靈鼓班別學費見課程頁。\n\n完整內容（供 AI 讀取）：${origin}/llms-full.txt\n`;
  await writeFile(join(assets, "llms.txt"), llms.replace(/^(# .+\n)\n/, `$1\n${summary}\n`).replace(/\n\n香港長笛、笛子、洞簫與空靈鼓學習網站。/, ""), "utf8");
  let full = `# 張老師音樂頻道（完整內容）\n\n來源：${origin}/ ；以下為主要頁面全文，內容以網站最新版本為準。\n`;
  for (const f of keyPages) {
    const info = pageInfo[f];
    if (!info) continue;
    const m = info.h.match(/<main[\s\S]*?<\/main>/);
    const body = text(m ? m[0] : info.h);
    full += `\n---\n\n## ${info.title}\n網址：${info.canonical}\n\n${body}\n`;
  }
  await writeFile(join(assets, "llms-full.txt"), full, "utf8");

  const old = new Set((oldUrls || []).map((u) => new URL(u).pathname.replace(/^\//, "")));
  const lines = redirects.filter(([from]) => !from.includes("/") || from.startsWith("blog/")).map(([from, to]) => `/${from} ${to} 301`);
  await writeFile(join(assets, "_redirects"), `# 舊 oliverflute.com 網址 → 新網址（Cloudflare Pages／Netlify 格式；GitHub Pages 不使用）\n${lines.join("\n")}\n`, "utf8");
  // 只限 *.pages.dev（專案網址及版本／分支網址）noindex；自訂網域不受影響（Cloudflare _headers 以主機名匹配）
  await writeFile(join(assets, "_headers"), "https://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\nhttps://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n/admin*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n  Referrer-Policy: no-referrer\n/api/*\n  Cache-Control: no-store\n  X-Robots-Tag: noindex\n", "utf8");
  // Cloudflare Pages 會把 *.html 轉到無副檔名網址：站內連結、canonical、sitemap、轉向目標一律改用實際回 200 的網址（只改本站 .html，外站、圖片、腳本不動）
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const clean = (u) => {
    const m = u.match(/^([^?#]*?\.html)([?#].*)?$/s);
    if (!m) return u;
    let path = m[1];
    const tail = m[2] || "";
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path) && !path.startsWith(origin + "/")) return u;
    if (/(^|\/)404\.html$/.test(path)) return u;
    path = /(^|\/)index\.html$/.test(path) ? path.replace(/index\.html$/, "") || "./" : path.slice(0, -5);
    return path + tail;
  };
  const ownRe = new RegExp(esc(origin) + "/[^\"'\\s<>\\\\]*?\\.html(?:[?#][^\"'\\s<>\\\\]*)?", "g");
  for (const f of await readdir(assets, { recursive: true })) {
    if (f.startsWith("hero-options")) continue;
    const p = join(assets, f);
    const src = await readFile(p, "utf8").catch(() => null);
    if (src === null) continue;
    let out = src;
    if (f === "_redirects") out = src.split("\n").map((l) => (l.startsWith("/") ? l.replace(/^(\S+\s+)(\S+)/, (_, a, b) => a + clean(b)) : l)).join("\n");
    else if (/\.(?:html|txt|xml|webmanifest)$/.test(f)) {
      out = out.replace(ownRe, (u) => clean(u));
      if (f.endsWith(".html")) out = out.replace(/(\bhref=")([^"]*)(")/g, (_, a, u, c) => a + clean(u) + c).replace(/(http-equiv="refresh" content="[^"]*?url=)([^"]*)(")/g, (_, a, u, c) => a + clean(u) + c);
    } else if (f.endsWith("assets/js/blog-index.js")) out = out.replace(/("url":")([^"]+\.html)(")/g, (_, a, u, c) => a + clean(u) + c);
    else if (f.endsWith("assets/js/academy.js")) out = out.replace("slug+'-course.html'", "slug+'-course'");
    if (out !== src) await writeFile(p, out, "utf8");
  }
  return { stubs: redirects.length, oldTracked: old.size };
}
