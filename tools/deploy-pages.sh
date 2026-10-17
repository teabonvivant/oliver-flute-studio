#!/bin/sh
# 建置並把 dist/assets 推送到 gh-pages 分支（GitHub Pages 由該分支根目錄發布）
set -e
cd "$(dirname "$0")/.."
node build.mjs
node tools/verify_site.cjs > /dev/null
tmp=$(mktemp -d)
cp -R dist/assets/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name=zocomputer -c user.email=noreply@zo.computer commit -q -m "deploy: $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
cd "$OLDPWD" && rm -rf "$tmp"
echo "Deployed to gh-pages"
