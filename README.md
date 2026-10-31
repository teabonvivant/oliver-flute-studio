# 張老師音樂學院 · 新版網站

長笛、笛子、洞簫與空靈鼓學習網站，在音樂手記及課程頁之上，加入「練習室」及「出品」兩個部分。

**預覽：** https://teabonvivant.github.io/oliver-flute-studio/

## 內容

- 原有課程、學習指南、常見問題、聯絡頁及音樂手記。手記原稿是 `content/notes/*.md`（68 篇長文），舊站 20 篇在 `content/legacy-posts.json`，都發布到 `blog/`。
- 手記封面由真實相片裁出：`content/note-covers.json`（相片、裁切、alt）→ `python3 tools/build_note_covers.py`。主題頁 `topic-<slug>.html`（9 個）。舊站純譜文章的說明在 `content/legacy-intros.json`。
- 舊 200 條文章網址由 frontmatter 的 `replaces` 自動生成轉向（meta refresh＋canonical），舊 `archive/<slug>.html` 轉到 `blog/<slug>.html`。`content/new-*.md`、`legacy-curated.json`、`legacy-examples.txt` 是合併前的舊稿，建置不再使用。
- 練習室：調音器（`tuner.html`）、節拍器（`metronome.html`）、長笛指法表（`flute-fingering.html`）、長音練習（`long-tone.html`）。全部在瀏覽器運行，咪高峰聲音只在本機分析。
- 出品：譜間打譜軟件（`pujian.html`）、長笛紙牌及網上翻卡練習（`flute-cards.html`）、長笛演奏動畫試作及教學樂譜（`works.html`）。
- oliverflute.com 舊網址（例如 `/aboutme`、`/flute-class`）會轉到對應新頁。

## 結構

- `tools/render-site.mjs`、`tools/site-pages.mjs`：原有頁面及文章生成。文章寫法：開場段 → `## 小標題 {#錨點}` → `## 常見問題 {#faq}`（`### 問題`）；目錄和 FAQ schema 自動生成，只支援段落、清單、連結、粗體，其他語法會令建置失敗。
- `tools/studio-pages.mjs`：練習室及出品頁面內容。
- `assets/js/studio.js`：音高偵測、節拍器、指法資料（C4–A6 基本指法，依 Woodwind Fingering Guide）、長音計時、翻卡練習。
- `assets/css/studio.css`：新增區塊樣式，沿用 `editorial.css` 的色彩與字體。

## 建置與檢查

```sh
node build.mjs
node tools/verify_site.cjs
```

輸出在 `dist/assets/`。發布到 GitHub Pages：執行 `sh tools/deploy-pages.sh`，會重新建置、檢查，再把輸出推送到 `gh-pages` 分支。改用自訂網域時，以 `SITE_ORIGIN=https://www.oliverflute.com sh tools/deploy-pages.sh` 建置，令 canonical、sitemap 及 404 頁指向新網域。

## 中文字型

`assets/fonts/site/` 只收錄本站用到的字（Noto Serif TC 400／600，第 0 塊為最常用字並預載，其餘每 150 字一塊）。新增或修改文章後，如 `node build.mjs` 提示「字型未收錄」，下載 [Noto Serif TC 可變字型](https://github.com/google/fonts/raw/main/ofl/notoseriftc/NotoSerifTC%5Bwght%5D.ttf) 後執行 `python3 tools/build_fonts.py <檔案>`（需要 `pip install fonttools brotli`）。

插圖 `assets/images/editorial/` 每張另有 `-640`、`-1024` 縮圖供手機使用，新增插圖時一併產生。
