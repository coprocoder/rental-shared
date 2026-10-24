<script setup lang="ts">
/**
 * Вертикальная или горизонтальная стопка (Layout).
 *
 * ⚠️ Отступ берётся из ОДНОЙ числовой шкалы. В большом проекте, на
 * котором этот опыт получен, шкал было две параллельных — xxxs…xxxl
 * и s1…s10, — и выбор между ними каждый раз оказывался произвольным.
 */
withDefaults(defineProps<{
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  row?: boolean
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
}>(), { gap: 5, align: 'stretch', justify: 'start' })
</script>

<template>
  <div
    class="ui-stack"
    :class="[`ui-stack--a-${align}`, `ui-stack--j-${justify}`, { 'ui-stack--row': row, 'ui-stack--wrap': wrap }]"
    :style="{ gap: `var(--space-${gap})` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-stack {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ui-stack--row { flex-direction: row; }
.ui-stack--wrap { flex-wrap: wrap; }
.ui-stack--a-start { align-items: flex-start; }
.ui-stack--a-center { align-items: center; }
.ui-stack--a-end { align-items: flex-end; }
.ui-stack--a-baseline { align-items: baseline; }
.ui-stack--a-stretch { align-items: stretch; }
.ui-stack--j-start { justify-content: flex-start; }
.ui-stack--j-center { justify-content: center; }
.ui-stack--j-end { justify-content: flex-end; }
.ui-stack--j-between { justify-content: space-between; }
</style>
