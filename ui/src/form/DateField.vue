<script setup lang="ts">
import { computed, ref, watch } from 'vue'
/**
 * Поле даты в формате ДД.ММ.ГГГГ (Input).
 *
 * ⚠️ Своё поле, а не `<input type="date">`. Нативное рисует БРАУЗЕР,
 * и формат он берёт из своих языковых настроек, а не из `lang`
 * страницы: у сотрудника с английским Chrome та же дата выглядела как
 * 09/10/2026 вместо 10.09.2026 — месяц и день менялись местами.
 * Прочитать «09/10» неправильно ничего не стоит, а это дата, с которой
 * начинает действовать цена.
 *
 * ⚠️ Наружу отдаётся ISO «YYYY-MM-DD» — тот же контракт, что был
 * у нативного поля. Экраны и API не знают, что поле сменилось.
 *
 * ⚠️ Ввод не блокируется по ходу набора: пока строка неполная, она
 * просто не является датой, и наружу ничего не уходит. Ругаться на
 * «10.0» в момент, когда человек ещё печатает, — это мешать вводу.
 */
import Field from './Field.vue'

const props = withDefaults(defineProps<{
  /** ISO «YYYY-MM-DD» либо пусто. */
  modelValue?: string | null
  label?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>(), { modelValue: '' })

const emit = defineEmits<{ 'update:modelValue': [string] }>()

/** ISO → ДД.ММ.ГГГГ для показа. */
function toText(iso: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '')
  return m ? `${m[3]}.${m[2]}.${m[1]}` : ''
}

/**
 * ДД.ММ.ГГГГ → ISO. Пустая строка — осознанное «бессрочно», а не ошибка.
 *
 * ⚠️ Проверяется РЕАЛЬНОСТЬ даты, а не только форма: «31.02.2026»
 * проходит по маске, но такого дня нет, и Date молча превратил бы его
 * в 3 марта. Правило цены с датой, которой не было, — это спор
 * с клиентом, который нечем закрыть.
 */
function toIso(text: string): string | null {
  const t = text.trim()
  if (t === '') return ''
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(t)
  if (!m) return null
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const dt = new Date(Date.UTC(y, mo - 1, d))
  const real = dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
  return real ? `${m[3]}-${m[2]}-${m[1]}` : null
}

const text = ref(toText(props.modelValue))

// Значение может смениться снаружи (сброс черновика, ответ сервера).
// ⚠️ Не перезаписываем, пока строка соответствует тому же дню: иначе
// поле дёргается под пальцами, стирая незаконченный ввод.
watch(() => props.modelValue, (v) => {
  if (toIso(text.value) !== (v ?? '')) text.value = toText(v)
})

const invalid = computed(() => toIso(text.value) === null)

function onInput(v: string) {
  // Маска: цифры сами расставляются точками, чтобы не печатать их руками.
  const digits = v.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)
  text.value = parts.join('.')

  const iso = toIso(text.value)
  if (iso !== null) emit('update:modelValue', iso)
}
</script>

<template>
  <Field
    :model-value="text"
    :label="label"
    :hint="hint"
    :error="error || (invalid ? 'Дата в формате ДД.ММ.ГГГГ' : '')"
    :required="required"
    :disabled="disabled"
    placeholder="ДД.ММ.ГГГГ"
    inputmode="numeric"
    @update:model-value="onInput"
  />
</template>
