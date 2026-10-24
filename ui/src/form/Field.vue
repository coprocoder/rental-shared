<script setup lang="ts">
import { useId } from 'vue'
/**
 * Поле ввода с подписью (Input).
 *
 * ⚠️ Подпись связана с полем через for/id, а не положена рядом
 * визуально: без связи скринридер читает поле как безымянное, а тап по
 * подписи не переводит фокус — на телефоне это заметно сразу.
 */
withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  hint?: string
  error?: string
  type?: string
  inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'decimal'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  /**
   * ⚠️ Строка тоже: для type="date" границей служит «YYYY-MM-DD»,
   * а не число. Без этого поле даты пришлось бы верстать мимо кита —
   * то есть терять тему тенанта и плотность.
   */
  min?: number | string
  max?: number | string
}>(), { type: 'text' })

// ⚠️ blur пробрасывается явно: без этого слушатель попадёт на корневой
// div, а не на input, и «поле потеряло фокус» не сработает — на этом
// ломалась отложенная валидация формы (ошибка до первого ввода).
const emit = defineEmits<{ 'update:modelValue': [string], blur: [FocusEvent] }>()

const id = useId()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="ui-field">
    <label v-if="label" :for="id" class="ui-field__label">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </label>
    <input
      :id="id"
      class="ui-field__input"
      :class="{ 'ui-field__input--error': error }"
      :type="type"
      :inputmode="inputmode"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :min="min"
      :max="max"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error || hint ? `${id}-note` : undefined"
      @input="onInput"
      @blur="emit('blur', $event)"
    >
    <span v-if="error || hint" :id="`${id}-note`" class="ui-field__note" :class="{ 'ui-field__note--error': error }">
      {{ error || hint }}
    </span>
  </div>
</template>

<style scoped>
.ui-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-field__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.ui-field__input {
  height: var(--control-h);
  width: 100%;
  border-radius: var(--radius);
  background: var(--bg-surface);
  border: 1px solid var(--stroke-primary);
  padding: 0 13px;
  font: inherit;
  /* ⚠️ Не меньше 16px на телефоне, иначе iOS Safari зумит страницу при
     фокусе и вёрстка в iframe уезжает — а это как раз главный источник
     проблем с виджетом (8A.8). --font-size-control = 15px, поэтому
     16 задаётся отдельно ниже медиа-выражением. */
  font-size: var(--font-size-control);
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .ui-field__input {
    font-size: max(16px, var(--font-size-control));
  }
}

.ui-field__input:focus {
  outline: none;
  border-color: var(--stroke-focus);
  box-shadow: inset 0 0 0 1px var(--stroke-focus);
}

.ui-field__input--error {
  border-color: var(--stroke-danger);
}

.ui-field__input:disabled {
  background: var(--bg-subtle);
  color: var(--text-secondary);
}

.ui-field__note {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.ui-field__note--error {
  color: var(--text-danger);
}
</style>
