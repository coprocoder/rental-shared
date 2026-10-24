# Короткие команды. `make help` — список.
.PHONY: help install check typecheck test build fresh

help:  ## Показать список команд
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install:  ## Поставить зависимости
	npm install

check: typecheck test fresh  ## Всё перед выпуском версии

typecheck:  ## Проверить типы
	npm run typecheck

test:  ## Прогнать тесты
	npm test

build:  ## Собрать common/dist
	npm run build

# ⚠️ Потребители ставят пакет из git по тегу и получают ЗАКОММИЧЕННЫЙ
# dist: сборки при установке нет. Исходник, поправленный без пересборки,
# уехал бы в тег старым кодом — без единой ошибки.
fresh: build  ## dist совпадает с исходниками
	@git diff --quiet -- common/dist || { echo "common/dist устарел: соберите и закоммитьте"; exit 1; }
