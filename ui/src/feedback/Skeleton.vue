<script setup lang="ts">
/**
 * Заглушка на время загрузки (Feedback).
 *
 * ⚠️ Показывается там, где известна ФОРМА будущего содержимого — список
 * заказов, карточка. Где форма неизвестна, честнее спиннер: скелет
 * не той формы создаёт скачок вёрстки в момент загрузки.
 */
withDefaults(defineProps<{ lines?: number, height?: string }>(), { lines: 3 })
</script>

<template>
  <div class="ui-skel" aria-hidden="true">
    <div
      v-for="n in lines"
      :key="n"
      class="ui-skel__bar"
      :style="{
        height: height ?? '14px',
        /* Последняя строка короче: так блок читается как текст,
           а не как таблица. */
        width: n === lines && lines > 1 ? '62%' : '100%',
      }"
    />
  </div>
</template>

<style scoped>
.ui-skel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ui-skel__bar {
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  animation: ui-pulse 1.4s ease-in-out infinite;
}

/* ⚠️ Пульсация отключается по системной настройке: постоянное мерцание
   на экране — реальная проблема для части людей, а стоит это
   одно медиа-выражение. */
@media (prefers-reduced-motion: reduce) {
  .ui-skel__bar {
    animation: none;
  }
}

@keyframes ui-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
</style>
