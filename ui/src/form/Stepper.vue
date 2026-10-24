<script setup lang="ts">
// ⚠️ Явный импорт: в vitest автоимпортов Nuxt нет.
import { useTemplateRef } from 'vue'
/**
 * Счётчик количества (Input).
 *
 * ⚠️ Кнопки −/+ рядом с полем, а не только поле: правка остатка в
 * списке инвентаря идёт по одной штуке (13.4), и открывать клавиатуру
 * ради «было 12, стало 11» — лишнее действие. Поле при этом остаётся
 * доступным для ввода: «пересчитали, стало 47» вводится сразу.
 */
const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}>(), { min: 0, step: 1 })

const emit = defineEmits<{ 'update:modelValue': [number] }>()

const el = useTemplateRef<HTMLInputElement>('field')

function bump(delta: number) {
  const next = props.modelValue + delta * props.step
  if (next < props.min) return
  if (props.max !== undefined && next > props.max) return
  emit('update:modelValue', next)
}

/**
 * Ручной ввод в поле.
 *
 * ⚠️ `Number('')` даёт 0, а `Number('abc')` — NaN, и раньше оба
 * уходили наружу как есть: количество становилось NaN, дальше
 * «NaN шт.» в сводке и NaN в теле запроса. type="number" от этого
 * НЕ защищает — поле принимает вставку и раскладки, где «е» это
 * экспонента.
 *
 * ⚠️ Значение зажимается в границы, а не отбрасывается: сотрудник
 * ввёл 50 при максимуме 20 — он хотел много, и 20 ближе к намерению,
 * чем откат к прежнему числу.
 */
function onInput(raw: string) {
  const n = Number(raw)
  if (!Number.isFinite(n)) {
    // ⚠️ Мусор: модель не трогаем, но ПОЛЕ надо вернуть руками —
    // Vue не перерисует его, если значение модели не изменилось,
    // и в поле останется «abc» при корректном числе в модели.
    if (el.value) el.value.value = String(props.modelValue)
    return
  }
  const clamped = Math.min(
    props.max ?? Number.POSITIVE_INFINITY,
    Math.max(props.min, Math.round(n)),
  )
  // Зажатое значение тоже показываем: ввели 50 при максимуме 20 —
  // в поле должно стоять 20, а не 50.
  if (el.value) el.value.value = String(clamped)
  emit('update:modelValue', clamped)
}
</script>

<template>
  <div class="ui-stepper-wrap">
    <span v-if="label" class="ui-stepper__label">{{ label }}</span>
    <div class="ui-stepper">
      <button
        type="button"
        class="ui-stepper__btn"
        :disabled="disabled || modelValue <= min"
        aria-label="Уменьшить"
        @click="bump(-1)"
      >
        −
      </button>
      <input
        ref="field"
        class="ui-stepper__el num"
        type="number"
        inputmode="numeric"
        :value="modelValue"
        :min="min"
        :max="max"
        :disabled="disabled"
        @change="onInput(($event.target as HTMLInputElement).value)"
      >
      <button
        type="button"
        class="ui-stepper__btn"
        :disabled="disabled || (max !== undefined && modelValue >= max)"
        aria-label="Увеличить"
        @click="bump(1)"
      >
        +
      </button>
    </div>
  </div>
</template>

<style scoped>
.ui-stepper-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-stepper__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.ui-stepper {
  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--stroke-primary);
  border-radius: var(--radius);
  background: var(--bg-surface);
  overflow: hidden;
}

.ui-stepper__btn {
  width: var(--control-h-sm);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.ui-stepper__btn:hover:not(:disabled) {
  background: var(--bg-subtle);
}

.ui-stepper__btn:disabled {
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.ui-stepper__el {
  width: 58px;
  height: var(--control-h-sm);
  border: none;
  border-inline: 1px solid var(--stroke-subtle);
  background: transparent;
  text-align: center;
  font: inherit;
  font-size: var(--font-size-control);
  font-weight: 600;
  color: var(--text-primary);
  /* Нативные стрелки убираются: свои кнопки крупнее и попадаемы пальцем. */
  appearance: textfield;
}

.ui-stepper__el::-webkit-outer-spin-button,
.ui-stepper__el::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.ui-stepper__el:focus {
  outline: none;
  box-shadow: inset 0 0 0 1px var(--stroke-focus);
}
</style>
