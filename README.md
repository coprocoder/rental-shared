# rental-shared

Общий код фронта (`rental`) и бэка (`rental-backend`) проката.

| Пакет | Что | Как поставляется |
|---|---|---|
| `common/` → `@rental/common` | телефон, сезон, статусы заказа — то, что обе стороны обязаны понимать одинаково | собранный JS + `.d.ts` в `common/dist` (сервер исполняет его сам) |
| `ui/` → `@rental/ui` | UI-кит: компоненты Vue, токены, тёмная тема, тосты | исходниками: `.vue` собирает Vite потребителя |

## Подключение

По тегу, из git — без реестра пакетов:

```json
"dependencies": {
  "rental-shared": "github:coprocoder/rental-shared#v0.1.0",
  "@rental/common": "file:node_modules/rental-shared/common",
  "@rental/ui": "file:node_modules/rental-shared/ui"
}
```

⚠️ **Репозиторий публичный** — так `npm ci` в CI и Docker не нужен токен.
Lock-файл потребителя пишет адрес по ssh; где ssh-ключа нет (CI, Docker),
его переводят на https: `git config url."https://github.com/".insteadOf
ssh://git@github.com/`.

⚠️ `@rental/ui` потребитель подключает так, чтобы Vite и vitest его
компилировали, а не брали как готовую зависимость: `optimizeDeps.exclude`
и `server.deps.inline` (см. `vite.config.ts` и `vitest.workspace.ts` фронта).

## Выпуск версии

```bash
make check            # типы, тесты, dist совпадает с исходниками
git tag v0.X.Y && git push origin master v0.X.Y
```

Затем перевести потребителей: `./bump.sh ../rental v0.X.Y` и
`./bump.sh ../rental-backend v0.X.Y` (обычный `npm install` на смене тега
падает — почему, сказано в шапке скрипта), `make check` в каждом, коммит
`package.json` и `package-lock.json`. ⚠️ Версия в двух
потребителях может различаться только на время перехода: подписи
статусов, разбор телефона и сезон обязаны совпадать у клиента и сервера.

## Что сюда НЕ попадает

Код, нужный одной стороне. Права роли, функции тарифа и CSS-переменные
темы фронт получает от сервера готовыми; подсчёт дней аренды, контраст и
тема — только на сервере; CSV, почта — только на фронте.
