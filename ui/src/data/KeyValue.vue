<script setup lang="ts">
/**
 * Список «ключ — значение» (Output).
 *
 * ⚠️ Разметка именно `<dl>/<dt>/<dd>`, а не два столбца из div:
 * скринридер читает такой список парами и объявляет связь между
 * подписью и значением. Сеткой из div он читает шесть несвязанных
 * строк подряд.
 *
 * ⚠️ Содержимое отдаётся слотом, а не массивом пропов: значения
 * бывают со своим классом (`.num`, `.ok`/`.bad`) и рисуются через
 * v-for по разным источникам. Пропом это пришлось бы описывать
 * форматом, который на третьем экране всё равно не подошёл бы.
 *
 * Вёрстка была скопирована в трёх страницах (admin/branches,
 * admin/plan, index) — одинаковая с точностью до размера шрифта.
 */
withDefaults(defineProps<{
  /** Плотный вариант для админки, обычный — для витрины. */
  size?: 'sm' | 'md'
}>(), { size: 'sm' })
</script>

<template>
  <dl class="ui-kv" :class="`ui-kv--${size}`">
    <slot />
  </dl>
</template>

<style scoped>
.ui-kv {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-3) var(--space-6);
  margin: 0;
}

.ui-kv--sm { font-size: 13px; }
.ui-kv--md { font-size: 14px; }

.ui-kv :deep(dt) {
  color: var(--text-secondary);
  font-weight: 600;
}

/* ⚠️ Цвет задан явно: <dd> внутри Card наследовал бы приглушённый
   цвет карточки, и значение читалось бы бледнее подписи — наоборот
   тому, что нужно. */
.ui-kv :deep(dd) {
  margin: 0;
  color: var(--text-primary);
}
</style>
