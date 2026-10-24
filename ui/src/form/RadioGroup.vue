<script setup lang="ts">
import { useId } from 'vue'
/**
 * Группа переключателей (Input).
 *
 * Отличается от Segmented назначением: Segmented — компактный выбор
 * режима, RadioGroup — выбор из вариантов с пояснениями, где каждая
 * строка может нести описание (причина списания, способ оплаты).
 */
defineProps<{
  modelValue?: string | null
  options: { value: string, label: string, hint?: string }[]
  label?: string
  name?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const uid = useId()
</script>

<template>
  <fieldset class="ui-radio">
    <legend v-if="label" class="ui-radio__legend">{{ label }}</legend>
    <label v-for="o in options" :key="o.value" class="ui-radio__row" :class="{ 'ui-radio__row--on': modelValue === o.value }">
      <input
        type="radio"
        class="ui-radio__el"
        :name="name ?? uid"
        :value="o.value"
        :checked="modelValue === o.value"
        @change="emit('update:modelValue', o.value)"
      >
      <span class="ui-radio__text">
        <span class="ui-radio__title">{{ o.label }}</span>
        <span v-if="o.hint" class="ui-radio__hint">{{ o.hint }}</span>
      </span>
    </label>
  </fieldset>
</template>

<style scoped>
.ui-radio {
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-radio__legend {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 0 var(--space-2);
}

.ui-radio__row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-4);
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius);
  background: var(--bg-surface);
  cursor: pointer;
}

.ui-radio__row--on {
  border-color: var(--brand);
}

.ui-radio__el {
  width: 18px;
  height: 18px;
  accent-color: var(--brand);
  margin: 1px 0 0;
  flex-shrink: 0;
}

.ui-radio__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ui-radio__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.ui-radio__hint {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>
