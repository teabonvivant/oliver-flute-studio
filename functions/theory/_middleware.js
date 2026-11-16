// /theory/*（ABRSM 五級樂理，內部預覽）密碼把關：未登入一律只回登入頁，題庫、課文、譜圖都不外洩。
// 密碼放在 Pages 環境變數 THEORY_PASSWORD（secret）；未設定時整個路徑關閉。
const COOKIE = "g5t";
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
async function sign(pw) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("oliverflute-theory-v1")));
}
const page = (msg, status) => new Response(`<!doctype html><html lang="zh-Hant-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>請輸入密碼｜張老師音樂工作室</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f6f6;color:#22302f;font:17px/1.7 system-ui,-apple-system,"Microsoft JhengHei",sans-serif}form{width:min(360px,calc(100% - 48px));padding:32px;border-radius:22px;background:#fbfdfd;border:1px solid #d5e0df}h1{font-size:22px;margin:0 0 6px}p{margin:0 0 20px;color:#5d6a69}label{display:block;font-size:15px;margin-bottom:6px}input{box-sizing:border-box;width:100%;min-height:48px;padding:8px 14px;font:inherit;border:1px solid #8a9a99;border-radius:14px}button{margin-top:16px;width:100%;min-height:48px;border:0;border-radius:999px;background:#b04f3c;color:#fff;font:inherit;cursor:pointer}button:hover{background:#963f2f}:focus-visible{outline:3px solid #b04f3c;outline-offset:2px}.err{color:#9c2f2f;margin:12px 0 0}</style></head><body><form method="post"><h1>五級樂理（內部預覽）</h1><p>這個頁面未公開，請輸入密碼。</p><label for="pw">密碼</label><input id="pw" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">進入</button>${msg ? `<p class="err" role="alert">${msg}</p>` : ""}</form></body></html>`, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });

export async function onRequest({ request, env, next }) {
  if (!env.THEORY_PASSWORD) return new Response("尚未開放", { status: 503, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  const want = await sign(env.THEORY_PASSWORD);
  const got = (request.headers.get("cookie") || "").match(new RegExp(`(?:^|; )${COOKIE}=([a-f0-9]{64})`));
  if (got && got[1] === want) {
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set("cache-control", "private, no-cache");
    out.headers.set("x-robots-tag", "noindex, nofollow");
    return out;
  }
  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    if (form && form.get("password") === env.THEORY_PASSWORD)
      return new Response(null, { status: 303, headers: { location: new URL(request.url).pathname, "set-cookie": `${COOKIE}=${want}; Path=/theory; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`, "cache-control": "no-store" } });
    return page("密碼不正確，請再試。", 401);
  }
  return page("", 401);
}
