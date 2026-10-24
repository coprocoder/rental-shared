<script setup lang="ts">
/** Индикатор ожидания (Primitive). */
</script>

<template>
  <span class="ui-spinner" aria-hidden="true" />
</template>

<style scoped>
.ui-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-full);
  animation: ui-spin 0.7s linear infinite;
}

/* ⚠️ Анимация отключается по системной настройке: вестибулярные
   расстройства — реальная причина, и стоит это одну медиа-выражение. */
@media (prefers-reduced-motion: reduce) {
  .ui-spinner {
    animation-duration: 2s;
  }
}

@keyframes ui-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
