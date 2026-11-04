# 任務：把 oliverflute.com 加入 Cloudflare，取得名稱伺服器（給 Computer Use）

日期：2026-11-01｜帳戶：Cloudflare `oliverflute@gmail.com`｜網域：`oliverflute.com`

## 硬性限制

- 只做下面「A 部分」。**不要**改任何網域註冊商 / Strikingly 的名稱伺服器、DNS 或網站設定。
- **不要**發電郵給 Strikingly（B 部分由 Oliver 確認後才做）。
- 不要把任何密碼、權杖貼到聊天。
- 遇到付款、升級方案、Transfer、Unlock 等選項，一律不按，回報即可。

## A 部分：在 Cloudflare 加入網域

1. 用瀏覽器登入 https://dash.cloudflare.com/ （oliverflute@gmail.com）。
2. 按 **Add a domain**（或 Onboard a domain），輸入 `oliverflute.com`，按繼續。
3. 若出現「Quick scan for DNS records」，選 **Quick scan**，繼續。
4. 方案選 **Free**（最底那個），繼續。
5. 到「Review DNS records」頁，**逐行抄錄所有紀錄**（Type / Name / Content / Proxy 狀態）。檢查這兩項**必須存在**，缺的要手動新增，Proxy 狀態都設為 **DNS only（灰雲）**：
   - `MX`　名稱 `@`　內容 `mx.oliverflute.com.cust.b.hostedemail.com`　優先序 `1`
   - `TXT`　名稱 `@`　內容 `v=spf1 include:_spf.hostedemail.com ~all`
6. 其他掃描到的 A / CNAME（指向 Strikingly 的，如 `54.183.102.22`、`*.strikinglydns.com`）**先不要刪**，抄錄即可。
7. 繼續到「Change nameservers / Update your nameservers」那頁。**這頁會顯示兩個專屬名稱伺服器**（形式 `xxx.ns.cloudflare.com`）。把兩個**完整抄下**。**到此為止，不要按任何「Check nameservers」以外的動作。**
8. 若系統說網域已被另一個帳戶佔用 / 已存在 / 要驗證擁有權：截圖並照實回報，不要嘗試繞過。

## 回報格式（貼回聊天給 Zo）

```markdown
名稱伺服器 1：
名稱伺服器 2：
Cloudflare 掃描到的 DNS 紀錄（Type / Name / Content / Proxy）：
  …
MX 與 SPF TXT 是否已存在：是 / 否（若手動新增，註明）
異常 / 截圖說明：
```

## A2 部分：改名稱伺服器前的準備（2026-11-01 補，A 部分已完成）

A 部分結果：新名稱伺服器 `lady.ns.cloudflare.com`、`vin.ns.cloudflare.com`；4 條紀錄（A、www CNAME、MX、SPF TXT）已在 Cloudflare。

只做這一件事：

1. Cloudflare → oliverflute.com → DNS → Records：把 `A oliverflute.com` 和 `CNAME www` 的雲朵由 Proxied（橙）改為 **DNS only（灰）**。MX、TXT 不動。其他不要動。
   原因：切換初期舊站仍由 Strikingly 供應，灰雲＝與現在直連行為一致，避免 Cloudflare 代理令 Strikingly 憑證出錯。
2. 回報截圖。**仍然不要寄信、不要改名稱伺服器。**

## 待核實：A、CNAME 旁的 Warning 圖示（Codex 補充報告，2026-11-01）

Cloudflare DNS 審核頁的 `A oliverflute.com` 和 `CNAME www` 旁各有 Warning 圖示，原因未確認（點擊後無說明）。寄信前核實：

1. 做完 A2（改灰雲）後，到 DNS → Records 看 Warning 是否消失；若仍在，滑鼠移到圖示或展開該行，抄下提示全文。
2. 回報提示全文。不要因 Warning 而自行刪改紀錄。

## 待核實：其他郵件紀錄（DKIM、子網域等）是否漏掉（2026-11-01）

Cloudflare 快速掃描只有 4 項，不能當作完整區域。寄信前必須對照原有 DNS 區域，**唯讀、不改任何設定**：

1. Strikingly 後台 → oliverflute.com 網域 → 「打開 DNS 管理界面」，逐行抄錄所有紀錄（Type / Name / Content / 優先序）。若該介面只能顯示部分或無法打開，照實回報。
2. 與 Cloudflare DNS → Records 逐行比對，列出 Cloudflare 缺少的。特別留意：名稱含 `_domainkey` 的 TXT/CNAME（DKIM）、`_dmarc`、`autodiscover`、`webmail`、`mail`、`mx` 等子網域。
3. 另一個證據：用 oliverflute.com 的信箱寄一封信到另一個信箱（如 Gmail），開「顯示原始郵件」，抄下 `DKIM-Signature` 內的 `d=` 和 `s=`。`s=` 就是 DKIM 的選擇器，對應 `<s>._domainkey.oliverflute.com` 必須在 Cloudflare 存在。
4. 回報缺少清單；不要自行新增或刪除。

## B 部分：寄信給 Strikingly（等 Oliver 說「可以寄」才做）

前提：新站已在 Cloudflare Pages 綁定好 oliverflute.com，Oliver 確認切換。改了名稱伺服器後，Strikingly 舊站會立即失效。

- 寄件：teabonvivant@gmail.com（與 5/23 joyful-drumhk.com 同一帳戶）
- 收件：support@strikingly.com
- 主旨：請更改 oliverflute.com 的名稱伺服器

內文（把【NS1】【NS2】換成 A 部分抄到的兩個）：

> 你好，
>
> 請幫我將網域 oliverflute.com 的名稱伺服器改為：
>
> 【NS1】
> 【NS2】
>
> 我的網站將不再由 Strikingly 託管，所以不需要 Strikingly 的 DNS 功能。我已在新平台設定好所有 DNS 紀錄（包括電郵），並明白更改後 Strikingly 內的解析設定會失效。
>
> 這與之前 joyful-drumhk.com 的做法相同。請在完成後回覆確認，謝謝！
>
> Hi, please change the nameservers for oliverflute.com to the two Cloudflare nameservers above. The website will no longer be hosted on Strikingly, so I don't need Strikingly's DNS features. I understand the existing DNS settings in Strikingly will stop working. Thank you!

寄出後：截圖已寄出，回報給 Zo。Strikingly 上次約 9 小時內回覆，生效 數小時至 48 小時。

## 進度記錄（2026-11-01，Codex 回報）

- A2 完成：`A oliverflute.com`、`CNAME www` 已改 DNS only（灰雲）；MX、SPF TXT 未動。兩行的 Warning 圖示已消失。灰雲後出現的「Proxying is required…」只是一般提示，不處理。
- 網域在 Cloudflare 仍是 pending（要改名稱伺服器後才啟用），未改。
- 紀錄對照：Strikingly DNS 管理界面只列 4 條（A、www CNAME、MX、SPF TXT），Cloudflare 全部已有，沒有缺漏。兩邊都沒有 `_domainkey`、`_dmarc`、`autodiscover` 等。
- **尚未核實**：實際寄信有沒有 DKIM。Strikingly 沒列 @oliverflute.com 郵箱，網頁郵箱要 Oliver 親自登入。待辦：登入郵箱寄一封信到 Gmail，看「顯示原始郵件」有沒有 `DKIM-Signature`（沒有＝不用 `_domainkey`，風險解除；有＝抄下 `s=`，到 Cloudflare 補對應紀錄）。
- 仍未寄信給 Strikingly（B 部分），也未改名稱伺服器；須新站在 Cloudflare Pages 綁定好、Oliver 說「可以寄」才做。

## 郵箱確認（2026-11-01，Codex 回報）

- Oliver 確認 oliverflute.com 本來沒有用網域郵址，故不做 DKIM 測試信；DKIM 核實項取消。
- 風險結論：沒有網域郵箱，改 NS 不影響收發信。MX、SPF 已原樣保留。唯一殘餘可能是第三方服務（表單、報名系統等）以該網域名義寄信；Oliver 若沒有設定過，可視為無。
- 剩下的前提只有一項：新站在 Cloudflare Pages 綁定 oliverflute.com 與 www，並由 Oliver 說「可以寄」，才做 B 部分。