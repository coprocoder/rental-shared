#!/usr/bin/env bash
# Перевести потребителя на тег rental-shared.
#
#   ./bump.sh ../rental v0.2.0
#   ./bump.sh ../rental-backend v0.2.0
#
# ⚠️ Зачем скрипт, а не `npm install rental-shared@github:…#тег`: пакеты
# @rental/* подключены ссылкой file:node_modules/rental-shared/<пакет>, и
# при смене тега npm падает с «Cannot destructure property 'package' of
# 'node.target' as it is null» — lock-файл держит ссылки на старое дерево.
# Лечится только удалением этих записей из lock и чистой установкой.
set -euo pipefail
dir="${1:?каталог потребителя}"; tag="${2:?тег, например v0.2.0}"
cd "$dir"
git ls-remote --exit-code --tags https://github.com/coprocoder/rental-shared.git "$tag" >/dev/null \
  || { echo "тега $tag нет на GitHub" >&2; exit 1; }
TAG="$tag" node -e '
const fs = require("fs")
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
pkg.dependencies["rental-shared"] = "github:coprocoder/rental-shared#" + process.env.TAG
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n")
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"))
for (const k of Object.keys(lock.packages))
  if (k.includes("rental-shared") || k.startsWith("node_modules/@rental/")) delete lock.packages[k]
fs.writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n")
'
rm -rf node_modules/rental-shared node_modules/@rental
npm install
echo "→ $dir на rental-shared $tag; дальше make check и коммит package.json + package-lock.json"
