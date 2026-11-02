#!/bin/sh
# 建置並部署到 Cloudflare Pages（專案 oliverflute-studio）。用法：cf-deploy.sh preview|production
#   preview    → 分支 admin-preview（預覽網址 admin-preview.oliverflute-studio.pages.dev，noindex）
#   production → 分支 main（正式站 www.oliverflute.com）；只應由後台「發佈到正式站」掣呼叫
# 在暫存複本內建置，不動工作目錄；需要環境變數 CF_OLIVERFLUTE_TOKEN、CF_OLIVERFLUTE_ACCOUNT_ID。
set -e
case "$1" in preview) branch=admin-preview;; production) branch=main;; *) echo "用法：$0 preview|production" >&2; exit 2;; esac
[ -n "$CF_OLIVERFLUTE_TOKEN" ] && [ -n "$CF_OLIVERFLUTE_ACCOUNT_ID" ] || { echo "缺少 CF_OLIVERFLUTE_TOKEN／CF_OLIVERFLUTE_ACCOUNT_ID" >&2; exit 3; }
src=$(cd "$(dirname "$0")/.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
tar -C "$src" --exclude=./dist --exclude=./_team_runs --exclude=./.git --exclude=./node_modules -cf - . | tar -C "$tmp" -xf -
cd "$tmp"
SITE_ORIGIN=https://www.oliverflute.com node build.mjs
CLOUDFLARE_API_TOKEN="$CF_OLIVERFLUTE_TOKEN" CLOUDFLARE_ACCOUNT_ID="$CF_OLIVERFLUTE_ACCOUNT_ID" \
  node /home/workspace/Projects/whatsapp-cs-v2/node_modules/wrangler/bin/wrangler.js pages deploy dist/assets \
  --project-name oliverflute-studio --branch "$branch" --commit-dirty=true --commit-message "admin ${1} $(date -u +%Y%m%dT%H%MZ)"
