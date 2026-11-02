// 後台橋接：瀏覽器 ⇄ 本函數 ⇄ Zo（/api/ofs-admin）。密碼驗證、鎖定、對話與檔案都在 Zo 端；
// 本函數只保管登入 cookie（HttpOnly）並附上橋接密鑰。環境變數：ZO_BRIDGE_KEY（Pages secret）。
const UPSTREAM = "https://olivercheung.zo.space/api/ofs-admin";
const COOKIE = "ofs_s";
const json = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...h } });

export async function onRequest({ request, env }) {
  if (!env.ZO_BRIDGE_KEY) return json({ error: "後台尚未設定" }, 503);
  const url = new URL(request.url);
  if (request.method !== "GET" && request.method !== "POST") return json({ error: "不支援" }, 405);
  if (request.method === "POST" && request.headers.get("x-requested-with") !== "ofs") return json({ error: "請求來源不正確" }, 403);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ error: "請求來源不正確" }, 403);

  const cookie = (request.headers.get("cookie") || "").match(new RegExp(`(?:^|; )${COOKIE}=([a-f0-9]{64})`));
  const headers = new Headers({
    "x-ofs-bridge": env.ZO_BRIDGE_KEY,
    "x-ofs-ip": request.headers.get("cf-connecting-ip") || "?",
    "x-ofs-session": cookie ? cookie[1] : "",
  });
  const ct = request.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const init = { method: request.method, headers };
  let action = "";
  if (request.method === "POST") {
    const buf = await request.arrayBuffer();
    if ((ct || "").includes("json")) try { action = JSON.parse(new TextDecoder().decode(buf)).a; } catch {}
    init.body = buf;
  }
  const up = await fetch(UPSTREAM + url.search, init).catch(() => null);
  if (!up) return json({ error: "暫時連不上管理服務，請稍後再試" }, 502);

  const out = new Headers({ "cache-control": "no-store" });
  for (const k of ["content-type", "content-disposition", "x-content-type-options"]) if (up.headers.get(k)) out.set(k, up.headers.get(k));
  const isJson = (up.headers.get("content-type") || "").includes("json");
  if (isJson && request.method === "POST") {
    const d = await up.json().catch(() => null);
    if (d && d.token) {
      out.append("set-cookie", `${COOKIE}=${d.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${d.maxAge || 86400}`);
      delete d.token;
    }
    if (action === "logout") out.append("set-cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
    return new Response(JSON.stringify(d), { status: up.status, headers: out });
  }
  return new Response(up.body, { status: up.status, headers: out });
}
