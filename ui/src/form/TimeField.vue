<script setup lang="ts">
import { computed, ref, watch } from 'vue'
/**
 * Поле времени в 24-часовом формате ЧЧ:ММ (Input).
 *
 * ⚠️ Своё поле, а не `<input type="time">`. Нативное рисует БРАУЗЕР
 * по своим языковым настройкам: у сотрудника с английским Chrome
 * модалка расписания показывала «10:00 AM», тогда как таблица рядом —
 * «10:00». Два формата на одном экране, и один из них не тот,
 * в котором прокат работает. Атрибут `lang` страницы на это не влияет.
 *
 * ⚠️ Наружу отдаётся «HH:MM» — тот же контракт, что был у нативного
 * поля, так что сервер и экраны о замене не знают.
 */
import Field from './Field.vue'

const props = withDefaults(defineProps<{
  /** «HH:MM» либо пусто. */
  modelValue?: string | null
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
}>(), { modelValue: '' })

const emit = defineEmits<{ 'update:modelValue': [string] }>()

function toText(v: string | null | undefined): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(v ?? '')
  return m ? `${m[1]!.padStart(2, '0')}:${m[2]}` : ''
}

/** «ЧЧ:ММ» → нормализованное время. null — введено не время. */
function toTime(text: string): string | null {
  const t = text.trim()
  if (t === '') return ''
  const m = /^(\d{2}):(\d{2})$/.exec(t)
  if (!m) return null
  const [h, min] = [Number(m[1]), Number(m[2])]
  // ⚠️ 24:00 не принимаем: конец суток здесь пишется как 23:59,
  // а «24:00» Postgres примет и сдвинет на следующий день.
  return h <= 23 && min <= 59 ? `${m[1]}:${m[2]}` : null
}

const text = ref(toText(props.modelValue))

watch(() => props.modelValue, (v) => {
  if (toTime(text.value) !== toText(v)) text.value = toText(v)
})

const invalid = computed(() => toTime(text.value) === null)

function onInput(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  text.value = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits

  const time = toTime(text.value)
  if (time !== null) emit('update:modelValue', time)
}
</script>

<template>
  <Field
    :model-value="text"
    :label="label"
    :hint="hint"
    :error="error || (invalid ? 'Время в формате ЧЧ:ММ' : '')"
    :disabled="disabled"
    placeholder="ЧЧ:ММ"
    inputmode="numeric"
    @update:model-value="onInput"
  />
</template>
