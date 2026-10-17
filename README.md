# 張老師音樂學院 · 新版網站

長笛、笛子、洞簫與空靈鼓學習網站，在原有 200 篇音樂手記及課程頁之上，加入「練習室」及「出品」兩個部分。

**預覽：** https://teabonvivant.github.io/oliver-flute-studio/

## 內容

- 原有課程、學習指南、常見問題、聯絡頁及 200 篇音樂手記（源自 `teabonvivant/oliver-flute-academy`）。
- 練習室：調音器（`tuner.html`）、節拍器（`metronome.html`）、長笛指法表（`flute-fingering.html`）、長音練習（`long-tone.html`）。全部在瀏覽器運行，咪高峰聲音只在本機分析。
- 出品：譜間打譜軟件（`pujian.html`）、長笛紙牌及網上翻卡練習（`flute-cards.html`）、長笛演奏動畫試作及教學樂譜（`works.html`）。
- oliverflute.com 舊網址（例如 `/aboutme`、`/flute-class`）會轉到對應新頁。

## 結構

- `tools/render-site.mjs`、`tools/site-pages.mjs`：原有頁面及文章生成。
- `tools/studio-pages.mjs`：練習室及出品頁面內容。
- `assets/js/studio.js`：音高偵測、節拍器、指法資料（C4–A6 基本指法，依 Woodwind Fingering Guide）、長音計時、翻卡練習。
- `assets/css/studio.css`：新增區塊樣式，沿用 `editorial.css` 的色彩與字體。

## 建置與檢查

```sh
node build.mjs
node tools/verify_site.cjs
```

輸出在 `dist/assets/`。發布到 GitHub Pages：執行 `sh tools/deploy-pages.sh`，會重新建置、檢查，再把輸出推送到 `gh-pages` 分支。改用自訂網域時，以 `SITE_ORIGIN=https://www.oliverflute.com sh tools/deploy-pages.sh` 建置，令 canonical、sitemap 及 404 頁指向新網域。
