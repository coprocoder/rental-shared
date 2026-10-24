<script setup lang="ts">
/**
 * Сетка (Layout).
 *
 * ⚠️ Колонки схлопываются в одну на узком экране через auto-fit, а не
 * через брейкпоинты: у виджета «узкий экран» — это не телефон, а iframe
 * шириной 360 px на десктопе, и медиазапрос по ширине окна там врёт.
 */
withDefaults(defineProps<{
  /** Минимальная ширина колонки — сетка сама решает, сколько их влезет. */
  min?: string
  cols?: number
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}>(), { gap: 4 })
</script>

<template>
  <div
    class="ui-grid"
    :style="{
      gap: `var(--space-${gap})`,
      gridTemplateColumns: cols
        ? `repeat(${cols}, minmax(0, 1fr))`
        : `repeat(auto-fit, minmax(${min ?? '180px'}, 1fr))`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-grid {
  display: grid;
}
</style>
