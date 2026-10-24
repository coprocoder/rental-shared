<script setup lang="ts">
/**
 * Ограничитель ширины (Layout).
 *
 * Три размера, потому что задач ровно три: клиентская форма (узкая,
 * читается одной колонкой), карточка заказа, широкие списки админки.
 */
withDefaults(defineProps<{ size?: 'form' | 'card' | 'wide' }>(), { size: 'wide' })
</script>

<template>
  <div class="ui-container" :class="`ui-container--${size}`"><slot /></div>
</template>

<style scoped>
.ui-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* 430 px — ширина клиентской формы: одна колонка, большой палец
   дотягивается до любого элемента. */
.ui-container--form { max-width: 430px; }
.ui-container--card { max-width: 760px; }
.ui-container--wide { max-width: 1180px; }
</style>
