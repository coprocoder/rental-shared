<script setup lang="ts">
import { useId } from 'vue'
/**
 * Выпадающий список (Input).
 *
 * ⚠️ Нативный <select>, а не Reka Select. Причина конкретная: нативный
 * на телефоне открывает системный барабан выбора, который работает
 * лучше любой веб-реализации, а на стойке — привычный список с поиском
 * по первой букве. Reka Select нужен там, где в пункт списка надо
 * положить разметку (цену, картинку); в админке таких мест нет.
 *
 * ⚠️ Combobox из Reka UI не использовать там, где важен VoiceOver —
 * известная слабость библиотеки (25-дизайн-система.md).
 */
defineProps<{
  modelValue?: string | number | null
  label?: string
  hint?: string
  options: { value: string | number, label: string, disabled?: boolean }[]
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [string] }>()
const id = useId()
</script>

<template>
  <div class="ui-select">
    <label v-if="label" :for="id" class="ui-select__label">{{ label }}</label>
    <div class="ui-select__box">
      <select
        :id="id"
        class="ui-select__el"
        :value="modelValue ?? ''"
        :disabled="disabled"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o.value" :value="o.value" :disabled="o.disabled">
          {{ o.label }}
        </option>
      </select>
      <span class="ui-select__chev" aria-hidden="true">▾</span>
    </div>
    <span v-if="hint" class="ui-select__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.ui-select {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-select__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.ui-select__box {
  position: relative;
}

.ui-select__el {
  height: var(--control-h);
  width: 100%;
  border-radius: var(--radius);
  background: var(--bg-surface);
  border: 1px solid var(--stroke-primary);
  padding: 0 34px 0 13px;
  font: inherit;
  font-size: var(--font-size-control);
  color: var(--text-primary);
  appearance: none;
  cursor: pointer;
}

.ui-select__el:focus {
  outline: none;
  border-color: var(--stroke-focus);
  box-shadow: inset 0 0 0 1px var(--stroke-focus);
}

.ui-select__chev {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  font-size: 12px;
}

.ui-select__hint {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
