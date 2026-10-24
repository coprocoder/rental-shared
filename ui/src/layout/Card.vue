<script setup lang="ts">
/** Карточка (Output): поверхность для группы связанных данных. */
withDefaults(defineProps<{
  title?: string
  /** Выделенная рамка: выбранная позиция, активная смена. */
  selected?: boolean
  padded?: boolean
}>(), { padded: true })
</script>

<template>
  <section class="ui-card" :class="{ 'ui-card--on': selected, 'ui-card--pad': padded }">
    <header v-if="title || $slots.actions" class="ui-card__head">
      <h2 v-if="title" class="ui-card__title">{{ title }}</h2>
      <div v-if="$slots.actions" class="ui-card__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.ui-card {
  background: var(--bg-surface);
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.ui-card--pad {
  padding: var(--space-6);
}

.ui-card--on {
  border-color: var(--brand);
}

.ui-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.ui-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ui-card__actions {
  display: flex;
  gap: var(--space-3);
}
</style>
