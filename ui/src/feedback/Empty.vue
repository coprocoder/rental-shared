<script setup lang="ts">
/**
 * Пустое состояние (Feedback).
 *
 * ⚠️ Пустой список — это не ошибка, и текст не должен звучать как
 * ошибка. «Пока нет заказов» плюс кнопка следующего действия, а не
 * «Ничего не найдено» без выхода: сотрудник в первый рабочий день
 * увидит именно этот экран.
 */
defineProps<{ title: string, hint?: string }>()
</script>

<template>
  <div class="ui-empty">
    <p class="ui-empty__title">{{ title }}</p>
    <p v-if="hint" class="ui-empty__hint">{{ hint }}</p>
    <div v-if="$slots.default" class="ui-empty__act"><slot /></div>
  </div>
</template>

<style scoped>
.ui-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-10) var(--space-6);
  text-align: center;
}

.ui-empty__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.ui-empty__hint {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 40ch;
}

.ui-empty__act {
  margin-top: var(--space-3);
}
</style>
