<script setup lang="ts">
/**
 * Сообщение в потоке страницы (Output).
 *
 * ⚠️ Не Toast: Toast исчезает, а это сообщение остаётся, пока причина
 * не устранена. Ошибка формы, предупреждение «на эти даты остался один
 * комплект», подсказка о расхождении на стойке — всё это нельзя
 * показывать всплывашкой, которую сотрудник не успел прочитать.
 */
withDefaults(defineProps<{
  tone?: 'info' | 'ok' | 'warn' | 'danger'
  title?: string
}>(), { tone: 'info' })
</script>

<template>
  <div :class="['ui-msg', `ui-msg--${tone}`]" :role="tone === 'danger' ? 'alert' : 'status'">
    <strong v-if="title" class="ui-msg__title">{{ title }}</strong>
    <div class="ui-msg__body"><slot /></div>
  </div>
</template>

<style scoped>
.ui-msg {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-5);
  border-radius: var(--radius);
  font-size: 13px;
  line-height: 1.5;
  /* Полоса слева, а не рамка кругом: рамка спорит с карточками вокруг,
     а полоса читается как «это про блок ниже». */
  border-left: 3px solid transparent;
}

.ui-msg__title {
  font-size: 13px;
  font-weight: 700;
}

.ui-msg--info {
  background: var(--bg-subtle);
  color: var(--text-secondary);
  border-left-color: var(--text-tertiary);
}

.ui-msg--ok {
  background: var(--bg-ok-subtle);
  color: var(--text-ok);
  border-left-color: var(--text-ok);
}

.ui-msg--warn {
  background: var(--bg-warn-subtle);
  color: var(--text-warn);
  border-left-color: var(--text-warn);
}

.ui-msg--danger {
  background: var(--bg-danger-subtle);
  color: var(--text-danger);
  border-left-color: var(--text-danger);
}
</style>
