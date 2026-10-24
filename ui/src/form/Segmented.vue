<script setup lang="ts">
/**
 * Переключатель из нескольких вариантов (Input).
 *
 * ⚠️ Используется вместо селекта, когда вариантов 2–4 и выбор частый:
 * на стойке лишнее открывание списка — это секунда из десяти,
 * отведённых на позицию (24-стойка.md).
 *
 * Семантика radiogroup, а не набор кнопок: иначе скринридер не сообщает
 * ни того, что выбор один, ни сколько всего вариантов.
 */
defineProps<{
  modelValue?: string | number | null
  options: { value: string | number, label: string, disabled?: boolean }[]
  label?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [string | number] }>()
</script>

<template>
  <div class="ui-seg-wrap">
    <span v-if="label" class="ui-seg__label">{{ label }}</span>
    <div class="ui-seg" role="radiogroup" :aria-label="label">
      <button
        v-for="o in options"
        :key="o.value"
        type="button"
        role="radio"
        :aria-checked="modelValue === o.value"
        :disabled="o.disabled"
        class="ui-seg__item"
        :class="{ 'ui-seg__item--on': modelValue === o.value }"
        @click="emit('update:modelValue', o.value)"
      >
        {{ o.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ui-seg-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-seg__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.ui-seg {
  display: flex;
  gap: var(--space-1);
  padding: 3px;
  background: var(--bg-subtle);
  border-radius: var(--radius);
}

.ui-seg__item {
  flex: 1;
  height: calc(var(--control-h) - 6px);
  border: none;
  background: transparent;
  border-radius: calc(var(--radius) - 2px);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  padding: 0 var(--space-4);
}

.ui-seg__item--on {
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
}

.ui-seg__item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
