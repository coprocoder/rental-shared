<script setup lang="ts">
/**
 * Раскрывающийся блок (Output): заголовок всегда виден, подробности
 * по запросу.
 *
 * ⚠️ Нативный `<details>`, а не своя реализация на `v-if`. Причина не
 * в экономии: браузер сам даёт клавиатуру (Enter/Space), правильную
 * роль для скринридера, состояние `open` и — существеннее всего —
 * поиск по странице (Ctrl+F) находит текст внутри закрытого блока и
 * раскрывает его. Своя реализация теряет всё это молча.
 */
withDefaults(defineProps<{
  title: string
  /** Короткая строка рядом с заголовком: суть, пока блок закрыт. */
  summary?: string
  open?: boolean
}>(), { open: false })
</script>

<template>
  <details class="ui-disclosure" :open="open">
    <summary class="ui-disclosure__head">
      <span class="ui-disclosure__mark" aria-hidden="true" />
      <span class="ui-disclosure__text">
        <span class="ui-disclosure__title">{{ title }}</span>
        <span v-if="summary" class="ui-disclosure__summary">{{ summary }}</span>
      </span>
    </summary>
    <div class="ui-disclosure__body"><slot /></div>
  </details>
</template>

<style scoped>
.ui-disclosure {
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
}

.ui-disclosure__head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  cursor: pointer;
  /* Убираем стандартный треугольник: рисуем свой, чтобы он одинаково
     выглядел в Safari и Chrome. */
  list-style: none;
}

.ui-disclosure__head::-webkit-details-marker { display: none; }

.ui-disclosure__head:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: -2px;
  border-radius: var(--radius-md);
}

.ui-disclosure__mark {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-right: 2px solid var(--text-tertiary);
  border-bottom: 2px solid var(--text-tertiary);
  transform: rotate(-45deg);
  transition: transform 120ms ease;
}

.ui-disclosure[open] .ui-disclosure__mark {
  transform: rotate(45deg);
}

.ui-disclosure__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ui-disclosure__title {
  font-weight: 600;
  font-size: 14px;
}

.ui-disclosure__summary {
  font-size: 13px;
  color: var(--text-secondary);
}

.ui-disclosure__body {
  padding: 0 var(--space-4) var(--space-4) calc(var(--space-4) + 8px + var(--space-3));
  font-size: 13px;
  color: var(--text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .ui-disclosure__mark { transition: none; }
}
</style>
