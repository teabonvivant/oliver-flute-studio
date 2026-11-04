# oliverflute.com 搬到 Cloudflare：第一階段（給 Codex Computer Use）

日期：2026-11-01　負責人：Oliver　目標網站：oliverflute.com（新站源碼 `Projects/oliver-flute-studio/`）

## 目的
1. 在 Oliver 的 Cloudflare 帳號建立「只可部署 Pages」的 API 權杖，存入 Zo Secrets，讓 Zo 之後自行部署新站到 `*.pages.dev` 預覽網址。
2. 唯讀查看 Strikingly 的網域設定，回報能否轉 nameserver 或轉移網域。

## 絕對不要做
- 不要改任何 DNS、nameserver、網域設定，不要按「轉移」「解鎖」「取消訂閱」「刪除」。
- 不要在 Cloudflare 加入 oliverflute.com 這個網域（Add a site）。
- 不要修改或發布 Strikingly 上任何頁面。
- 不要把權杖貼進聊天、檔案、截圖或任何日誌；權杖只在 Cloudflare 顯示一次，直接填入 Zo Secrets。
- 遇到登入、驗證碼、兩步驗證、付款頁：停下，請 Oliver 親自處理，不要代填密碼。

## 任務 A：建立 Cloudflare 權杖
1. 開 https://dash.cloudflare.com ，帳號 oliverflute@gmail.com。需要登入時請 Oliver 自己輸入。
2. 在首頁右側（或網址列 `dash.cloudflare.com/<帳戶ID>`）找到 Account ID（32 位英數字），記下。這個不是機密。
3. 右上角頭像 → My Profile → API Tokens → Create Token → Custom token → Get started。
4. Token name：`zo-oliverflute-pages`。
5. Permissions 只加一行：`Account` · `Cloudflare Pages` · `Edit`。
6. Account Resources：Include → 只選 oliverflute@gmail.com 的帳戶。
7. 不設 IP 限制，TTL 留空，按 Continue to summary → Create Token。
8. 權杖只顯示一次，先不要離開頁面，進行任務 B。

## 任務 B：存入 Zo Secrets
1. 另開分頁到 https://olivercheung.zo.computer/?t=settings&s=advanced （Oliver 已登入 Zo）。
2. 在 Secrets 區新增兩項：
   - `CF_OLIVERFLUTE_TOKEN` = 剛才的權杖
   - `CF_OLIVERFLUTE_ACCOUNT_ID` = 任務 A 第 2 步的 Account ID
3. 儲存後確認兩個名稱已出現在列表（不需要顯示值）。
4. 回 Cloudflare 關閉權杖頁。若不慎遺失權杖：回 API Tokens 刪除 `zo-oliverflute-pages` 重建，不要嘗試找回。

## 任務 C：唯讀查看 Strikingly 網域設定
1. 開 https://www.strikingly.com 登入（Oliver 自己輸入密碼），進入 oliverflute.com 那個網站的設定 → Domain。
2. 只抄錄以下資訊（用文字回報，不改任何東西）：
   - 網域註冊商或供應商名稱（頁面上顯示的）
   - 網域購買／註冊日期、到期日
   - 是否有「Transfer out」「Unlock」「Authorization/EPP code」「Nameservers」「DNS Records」等選項，各自是否可按（只描述，不要按）
   - 是否顯示自動續期、網域私隱保護狀態
   - 網站目前的 DNS 紀錄清單（A、CNAME、MX、TXT 等，逐條抄錄；有電郵 MX 紀錄要特別標出）
3. 截圖只截網域設定頁，不要截到密碼或授權碼。

## 完成後回報給 Oliver（貼到 Zo 聊天室）
- 任務 A、B：是否完成；`CF_OLIVERFLUTE_TOKEN`、`CF_OLIVERFLUTE_ACCOUNT_ID` 是否已在 Zo Secrets 列表出現。
- 任務 C：上面第 2 點全部資訊。
- 任何卡住的步驟及原因。

## 驗收
- Zo Secrets 有兩個新名稱。
- Cloudflare 沒有新增網站（Websites 列表不變），DNS 無改動。
- Strikingly 沒有任何設定被修改。
