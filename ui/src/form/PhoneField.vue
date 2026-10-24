<script setup lang="ts">
import { computed, ref } from 'vue'
/**
 * Поле телефона с маской и проверкой (Input).
 *
 * ⚠️ ОДНО поле на весь проект. Маска и проверка номера повторялись
 * в форме бронирования и на выдаче без брони, и они разошлись: на
 * витрине номер форматировался и проверялся, на стойке — нет.
 * Номер один и правило одно: телефон это ключ, по которому заказ
 * ищут у стойки и по которому считается лимит активных броней.
 *
 * ⚠️ Буквы отбрасывает сама маска, поэтому «р8987» набрать нельзя
 * в принципе — проверка остаётся второй линией, а не единственной.
 *
 * ⚠️ Каретку возвращаем на место руками: после подстановки маски
 * браузер ставит её в конец, и исправить опечатку в середине номера
 * становится нельзя. Считаем значащие цифры до каретки, а не позицию
 * в строке.
 */
import Field from './Field.vue'
import { caretAfterFormat, formatPhone, phoneError } from '@rental/common'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  /** Показывать ошибку до того, как поле потеряло фокус. */
  showError?: boolean
}>(), { modelValue: '', label: 'Телефон' })

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const touched = ref(false)

/** Ошибка только после первого ухода из поля: ругаться на пустое
 *  поле, которое ещё не заполняли, — мешать вводу. */
const error = computed(() =>
  ((touched.value || props.showError) && props.modelValue)
    ? phoneError(props.modelValue)
    : null)

function onInput(v: string | number) {
  const raw = String(v)
  const el = document.activeElement as HTMLInputElement | null
  const caret = el?.selectionStart ?? raw.length
  const formatted = formatPhone(raw)
  emit('update:modelValue', formatted)

  if (el && el.type === 'tel') {
    // ⚠️ Значение в DOM выставляем сами, не полагаясь на перерисовку:
    // Vue не обновит :value, если новое значение совпало с прошлым
    // (набрали лишнюю цифру — маска её отбросила), и в поле осталась
    // бы сырая строка.
    const pos = caretAfterFormat(raw, caret, formatted)
    el.value = formatted
    el.setSelectionRange(pos, pos)
  }
}
</script>

<template>
  <Field
    :model-value="modelValue"
    :label="label"
    :hint="hint"
    :error="error ?? ''"
    :required="required"
    :disabled="disabled"
    type="tel"
    inputmode="tel"
    autocomplete="tel"
    placeholder="+7 999 000-00-00"
    @update:model-value="onInput"
    @blur="touched = true"
  />
</template>
