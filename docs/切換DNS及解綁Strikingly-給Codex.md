# oliverflute.com 正式切換（DNS＋Strikingly 解綁）— 給 Codex（Computer Use）

v3　日期：2026-11-02　狀態：**階段 A、B 已執行（DNS 已切換），階段 C 及其他待辦未執行。** 2026-11-02 Oliver 已批准按 www、根網域次序切換 DNS，`www.oliverflute.com` 與 `oliverflute.com` 兩個 Pages 網域已 Active；**Strikingly 仍未解綁**；根網域 301 到 www、`/sitemap.XML` 處理、Strikingly 解綁均尚未執行，需 Oliver 另行批准。詳見下文「切換後實況」。下文第 0–5 節為原計劃文字，保留作記錄。

背景：名稱伺服器已生效（lady／vin.ns.cloudflare.com），但 Pages 兩個自訂網域仍是 Verifying（旁邊有「Complete DNS setup」），公開 DNS 仍指向 Strikingly。舊 v1 文件要求「Pages Active 才改 DNS」，與現況互相卡死，本版重排次序。

**v3 更新（Codex 唯讀核查，2026-11-02）**：Cloudflare 在 Custom domains 詳情對 `www` 明示「Add the following CNAME record：Name `www`，Target `oliverflute-studio.pages.dev`」；根網域詳情也要求 CNAME 目標 `oliverflute-studio.pages.dev`（Name 欄空白）。兩行仍 Verifying。Codex 沒有按 Check DNS records，也沒有改任何設定。DNS Records 現有 4 條原狀：A `@` 54.183.102.22、CNAME `www`→Strikingly（均 DNS only）、MX 優先 1、SPF TXT。Oliver 已匯出 DNS BIND 備份並拍照，舊 Production `ba32a12e` 已記下。

## 切換後實況（2026-11-02，以下取代上文「草稿」狀態中與之衝突的部分）
- 已切換：Oliver 批准放寬次序（先 www、驗證後再 apex）。`www` CNAME 與根網域 CNAME 均指向 `oliverflute-studio.pages.dev`（Proxied），舊 A 54.183.102.22 已移除；Pages 兩個自訂網域 Active、SSL enabled；MX、SPF TXT 未動（DNS only）；名稱伺服器未改；Strikingly 未解綁。Production `4a50b026`，回退點 `ba32a12e`。
- Codex 驗證：www 的 `/about`、`/courses`、`/sitemap.xml`、`/robots.txt` 200，`/aboutme` 301→`/about`；無 `X-Robots-Tag: noindex`；canonical 指向 www。**根網域目前直接 200 顯示新站，並未 301 到 www**（Single Redirect 規則未建），不要聲稱已有此轉向。本機 DNS 上游仍有舊快取，其他網絡可能不同，不可宣稱全球已生效。
- Zo 驗證：sitemap 127 條網址全部通過；對照表內 4 條中文分類舊網址（樂器與考試、空靈鼓、練習心得、音樂雜談，已正確 URL 編碼）逐條實測均 301 到 `/archive`，目標 200。
- **Search Console（Codex 補充更正）**：在 Oliver 已登入的 Chrome 找到現有資源 `https://www.oliverflute.com/`，無需新增資源或 DNS 驗證。已重新提交 `sitemap.xml`，Google 顯示「已成功提交 Sitemap」；列表顯示 2026-11-02 上次讀取成功，探索到 127 個網址。**這只代表 sitemap 已被讀取，不代表 127 頁已收錄**，收錄情況需日後觀察。原有 `/sitemap.XML` 紀錄未刪。
- **舊紀錄 `/sitemap.XML`（大寫副檔名）— 待處理項**：Codex 唯讀實測（用 Cloudflare 新 DNS 對應 IP、驗證 TLS）`https://www.oliverflute.com/sitemap.xml` 回 200，但新站的 `/sitemap.XML` 目前回 **404**。Search Console 仍列著這條舊紀錄，顯示上次成功為 10 月 28 日，那是切換前舊站的結果；**不可推斷 Google 已對新站重新讀取它**。該紀錄不要刪除或修改。可選處理（需 Oliver 決定，尚未做）：在 `_redirects` 加 `/sitemap.XML` → `/sitemap.xml` 301，或日後確認 Google 已改讀小寫版後再決定是否移除。
- 仍待辦：根網域 → www 的 301（需 Oliver 批准）；Strikingly 解綁（階段 C，待穩定運行並由 Oliver 同意）；Search Console 收錄與舊網址覆蓋日後再看。

## 0. 授權範圍（硬性）
- 除非 Oliver 在聊天明確批准該一步，否則一律只讀、只截圖、只回報。
- 永遠不要：改 MX、SPF TXT；改名稱伺服器；寄信；刪除 Strikingly 網站；改 Strikingly 網站內容或發布。
- 畫面和描述不符、出現未預期警告，停下回報，不自行摸索。
- Oliver 說「切換」只代表批准下面「階段 A」；階段 B、C 要他逐段另行批准。

## 1. 已驗證／缺少／待驗證（Zo 於 2026-11-02 檢查）

已驗證（公開網址實測）
- **Production 現為 `4a50b026`**（2026-11-02 Zo 部署，與 Preview `11d07b87` 逐位元組相同；Codex 已獨立以 UI 及 HTTP 重新確認）。回退點 `ba32a12e`。主 pages.dev 的 `/`、`/about`、`/courses`、`/blog`、sitemap、robots、llms 均 200；canonical／og:url／sitemap／robots Sitemap 行均為 `https://www.oliverflute.com`，sitemap 127 個網址無 `.html`；`/aboutme` 301、`.html` 網址 308 到無副檔名。
- Cloudflare 對兩個自訂網域都明示要求先設 CNAME 指向 `oliverflute-studio.pages.dev`（見上）。
- 舊站 72 個 sitemap 網址在 pages.dev 全部有回應：21 個 200（首頁＋舊站 19 篇手記，路徑不變）、51 個 301 到新頁（例如 `/abrsm`→`/exam-guide.html`、`/1`→`/`）。轉向是 Pages 的 `_redirects`，真 301，不是 meta refresh。
- pages.dev 的 `robots.txt`、`sitemap.xml`（127 個網址）、`llms.txt`、`llms-full.txt` 都存在；robots 明確允許主要搜尋及 AI 爬蟲。
- 舊站主網域是 **www**：`oliverflute.com` 與 `http://` 都 301 到 `https://www.oliverflute.com/`，舊 sitemap 全是 www 網址。
- 公開 DNS（Cloudflare 1.1.1.1 查）：NS 已是 lady／vin；`oliverflute.com` A 仍是 54.183.102.22；`www` 仍 CNAME 到 Strikingly。

已解決（v3）
1. canonical 來源：已在隔離副本重建並部署（Production 4a50b026），pages.dev 上 canonical 等均為 www.oliverflute.com。原工作樹約 352 個未提交的 pages.dev 改寫檔案**仍保留未動**，日後勿在原工作樹直接重建覆蓋。
2. 「暫用 www 為主網址」只是準備假設，**正式選擇仍未確認**（見第 4 節決定 1）；若改選 apex，要重建並重新部署。

待驗證（現在驗證不到）
- Pages 自訂網域卡在 Verifying 的根因。v3 已知 Cloudflare 明示要先設 CNAME，但**現有 A／www CNAME 同名紀錄是否須先移除、驗證與憑證需時多久仍無保證**，亦未實測。早前推論：Cloudflare 文件說：apex 網域的名稱伺服器指向 Cloudflare 後，Cloudflare 會替你建立 CNAME；子網域在同一 zone 內，確認 DNS 後 CNAME 自動加入。現時 `oliverflute.com` 有 A 記錄、`www` 有指向 Strikingly 的 CNAME，同名紀錄很可能令自動建立／驗證完成不了。這是推論，**頁面沒顯示原因，要 Codex 按「Complete DNS setup」前先截圖該頁完整提示文字**。官方文件：https://developers.cloudflare.com/pages/configuration/custom-domains/
- noindex 機制：Cloudflare 官方只明確說 **preview deployments** 預設 noindex，**不能假設 production 的 pages.dev 預設 noindex**。現時 pages.dev 的 noindex 來自我們自己在 `_headers` 加的規則（只匹配 `:project.pages.dev` 與 `:version.:project.pages.dev`），已實測主站、部署網址、分支預覽皆有；`_headers` 不匹配 `www.oliverflute.com`，但自訂網域 Active 後仍須實測回應沒有 `x-robots-tag: noindex`。
- 正式網域憑證何時簽發、DNS 傳播何時完成：沒有保證時間。
- 「Google 已索引的舊網址全部是 www」未證實：只知舊 sitemap 與現行 301 以 www 為主，Search Console 實際收錄情況沒有數據，不能當事實。
- 新站首頁在 pages.dev 以外的真實手機載入表現（Lighthouse 只在本機量過）。
- DKIM 等郵件紀錄：Oliver 確認從未用網域郵箱，但不能排除第三方用此網域寄信，故 MX／SPF 保持不動。
- 舊站 13 個密碼頁（`drum-lesson1–8`、`drum-lesson61`、`mindruml1／2／5`、`2024mindrum`）：**Oliver 2026-11-02 決定不處理、新站不使用**。不要登入或擷取其內容，不是切換前置條件；舊站保持原狀（不刪頁、不改權限）。舊站 `2`、`3`、`5`、`6`、`12` 的轉向照舊保留。

## 2. 建議次序

### 階段 0：回滾準備（只讀，現在即可做）
1. Cloudflare → DNS → Records → **Export**，下載 BIND 檔存檔；另截圖整個 Records 頁。現有紀錄：A `@` 54.183.102.22（DNS only）、CNAME `www` → `www.oliverflute.com.s.strikinglydns.com`（DNS only）、MX 1 `mx.oliverflute.com.cust.b.hostedemail.com`、TXT SPF。
2. Pages 項目 `oliverflute-studio` → Deployments：目前 Production 是 `4a50b026`；舊 Production `ba32a12e` 為回退點（Codex／Oliver 已記下）。DNS BIND 匯出及截圖 Oliver 已完成。
3. Strikingly 網站和網域綁定**維持原狀**，切換期間不解綁。

### 階段 A：Zo 先處理新站（Oliver 批准後；此時舊站仍是正式站，不影響訪客）
1. 定主網域，修好 canonical 來源，按該網域重建，grep 確認沒有殘留 pages.dev，跑 `verify_site`。
2. 部署為新 Production 部署，在 pages.dev 驗證 canonical／sitemap／llms／robots 已是正式網域，51 條 301 仍有效。
3. 此步不碰 DNS。完成後 Zo 回報，等 Oliver 批准階段 B。

### 階段 B：DNS 切換（Oliver 另行明確批准後，由 Codex 做）
假設主網域用 www（見決定 1）：
1. 先處理 www：依 Cloudflare 明示，Name `www`、Target `oliverflute-studio.pages.dev`（把現有 CNAME 的目標改掉，改 Proxied）。動手前再截圖該頁提示；若提示與 v3 記錄不符，停止回報。按 Check DNS records 也屬此階段，需 Oliver 批准。
2. 等 Pages 的 `www.oliverflute.com` 變 Active（不保證多快）。Active 前訪客可能見到錯誤頁（例如 522），這是切換窗口的實際風險；若遲遲不 Active，按回滾。
3. 實測 www（第 3 節清單）通過後，才處理 apex：刪除 A `@` 54.183.102.22，加 CNAME `@`（Name 欄空白＝根）→ `oliverflute-studio.pages.dev`（Proxied），再建一條 Single Redirect 規則：`oliverflute.com/*` → `https://www.oliverflute.com/${1}`，301，保留 query。（Pages 不會自動做 www／apex 轉向。）
4. MX、SPF TXT 不動，確認仍為 DNS only。
5. 全程每步截圖。任何一步失敗就停，不要連環試錯。

### 階段 C：之後（至少穩定運行並由 Oliver 同意後）
- Strikingly 解綁網域（設置→網域→清空綁定→更新）。**不要放在階段 B 同日**：解綁令回滾要重新綁定，而 Strikingly 重新簽發憑證的所需時間未知。解綁只是解除網域，不是刪除網站。
- Zo：Search Console／Bing 驗證及提交 sitemap、舊網址抽測、pages.dev 轉向正式網域（需 Bulk Redirects 權限；現有權杖只有 Pages Edit，要由 Codex 在介面做或 Oliver 另授權，否則靠 canonical＋pages.dev 的 noindex 標頭）。

## 3. 切換後驗證清單（階段 B 每個網域 Active 後）
- `curl -I` 檢查：`https://www.oliverflute.com/`、`/about.html`、`/sitemap.xml`、`/robots.txt`、`/llms.txt`；`http://` 與裸網域應 301 到 `https://www`；回應不應有 `x-robots-tag: noindex`。
- 舊網址樣本：`/abrsm`、`/instrument`、`/1`、`/blog/breathe`、`/blog/breathe.html` 及帶尾斜線版本，確認 301 目標正確、不是 404。
- 首頁 canonical、og:url 是正式網址；sitemap 內網址全是正式網域。
- 瀏覽器（手機＋桌面）：首頁、一篇文章、WhatsApp 按鈕。
- 回報：每個網址的狀態碼、最終 DNS 紀錄清單、截圖、有無警告圖示。

## 4. 需要 Oliver 決定
1. **主網域用 www 還是 apex。** 建議 www：舊站所有已被 Google 收錄的網址都是 www，沿用最能保住 SEO。若選 apex，則 www 要 301 到 apex，舊網址會全部多一層轉向。
2. ~~是否批准階段 A~~ **已完成**：Production `4a50b026`（以 www 為暫定主網址）。若 Oliver 選 apex 則需重做。
3. ~~13 個密碼頁內容怎辦。~~ **已由 Oliver 決定（2026-11-02）：忽略，不搬、不取回，新站不使用；此項已取消。**
4. **是否批准階段 B。** 批准前不要以為卡住的 Verifying 會自己好；根因要 Codex 先截圖提示文字才能確定。

## 5. 回滾（只在 Oliver 要求時；不保證完成時間）
階段 B 之後、Strikingly 未解綁前：用階段 0 的匯出檔還原 A `@` → 54.183.102.22、CNAME `www` → `www.oliverflute.com.s.strikinglydns.com`（DNS only），刪除 apex 轉向規則。Pages 網域會變成未連接，之後想再切需重新驗證（Cloudflare 文件已提醒「DNS 改走再改回」會令自訂網域暫時不可用）。Strikingly 已解綁則要先重新綁定 oliverflute.com，所需時間未知。Pages 內容問題可到 Deployments 回退上一個 Production 部署。
