<script setup lang="ts">
import { computed } from 'vue'
/**
 * Выбор диапазона дат (Input, пункт 8A.7).
 *
 * ⚠️ Самый дорогой компонент проекта, и поэтому его логика взята
 * готовой (25-дизайн-система.md): диапазон, заблокированные дни,
 * клавиатурная навигация по сетке, объявление выбранного периода
 * скринридеру — это недели работы и годы багов на чужих устройствах.
 * Свои здесь только разметка и внешний вид.
 *
 * ⚠️ Русская локаль берётся из нативного Intl, а не из пакета локалей:
 * названия месяцев и дней Intl знает сам, а неделя с понедельника
 * задаётся week-starts-on. Пакет локалей — это лишние килобайты
 * в виджете, который платит за каждый (23-виджет.md).
 *
 * ⚠️ weekday-format='short', а не умолчательный 'narrow'. В русском
 * narrow даёт «П В С Ч П С В» — понедельник и пятница обе «П», вторник
 * и воскресенье обе «В». Клиент по такой шапке выходные не найдёт.
 * В английском narrow работает, поэтому умолчание библиотеки и такое.
 *
 * ⚠️ Недоступные дни задаются ПРЕДИКАТОМ, а не массивом дат. Это
 * причина, по которой в 25-дизайн-система.md отвергнут PrimeVue: там
 * disabledDates принимает список, а «филиал закрыт по вторникам и
 * категория вне сезона» списком не выражается — пришлось бы
 * генерировать все даты на год вперёд.
 *
 * ⚠️ Работа с датами через CalendarDate (@internationalized/date), а не
 * через Date: календарная дата не имеет часового пояса, и «15 января»
 * остаётся 15 января в любом поясе. Форма бронирования уже спотыкалась
 * ровно об это — ISO-момент давал разный день на сервере (UTC) и в
 * браузере (+7), ключ useFetch не совпадал, и форма мигала.
 */
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { CalendarDate, type DateValue, getLocalTimeZone, today } from '@internationalized/date'

const props = defineProps<{
  /** Начало периода, календарная дата YYYY-MM-DD. */
  from?: string
  /** Конец периода включительно, YYYY-MM-DD. */
  to?: string
  /** Раньше этого дня выбирать нельзя. По умолчанию — сегодня. */
  minDate?: string
  /** Позже — тоже: ограничение «не дальше N дней вперёд» из лимитов. */
  maxDate?: string
  /**
   * Дни, недоступные к выдаче: филиал закрыт, категория вне сезона.
   * Предикат, а не список — см. комментарий модуля.
   */
  unavailable?: (day: string) => boolean
  label?: string
  hint?: string
}>()

const emit = defineEmits<{ 'update:from': [string], 'update:to': [string] }>()

/** YYYY-MM-DD → CalendarDate. Без разбора через Date: пояс не участвует. */
function parse(s?: string): CalendarDate | undefined {
  if (!s) return undefined
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return undefined
  return new CalendarDate(y, m, d)
}

function fmt(d: DateValue): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

/**
 * Диапазон: сначала начало, потом конец.
 *
 * ⚠️ Пустой `end` НАДО передавать наверх, а не пропускать. Начиная новый
 * выбор, календарь присылает `{start: новая, end: undefined}` — это и есть
 * «выбираем заново». Условие `if (v.end)` такое обновление проглатывало,
 * и прошлая дата конца оставалась висеть: клик по началу не сбрасывал её,
 * а период получался из новой начальной и старой конечной даты.
 */
const value = computed({
  get: () => ({ start: parse(props.from), end: parse(props.to) }),
  set: (v: { start?: DateValue, end?: DateValue } | null) => {
    emit('update:from', v?.start ? fmt(v.start) : '')
    emit('update:to', v?.end ? fmt(v.end) : '')
  },
})

const minValue = computed(() => parse(props.minDate) ?? today(getLocalTimeZone()))
const maxValue = computed(() => parse(props.maxDate))

function isUnavailable(d: DateValue): boolean {
  return props.unavailable ? props.unavailable(fmt(d)) : false
}

/**
 * Выбранный период словами: ДД.ММ.ГГГГ — ДД.ММ.ГГГГ.
 *
 * ⚠️ Сетка показывает выбор подсветкой, но человеку нужно ПРОЧИТАТЬ,
 * что именно выбрано: подсветка в двух соседних месяцах читается плохо,
 * а на этом экране от даты зависит цена.
 *
 * ⚠️ Формат ДД.ММ.ГГГГ строится вручную из календарной даты, а не через
 * Intl над Date: превращение в Date вернуло бы часовой пояс, из-за
 * которого «15 января» на сервере (UTC) и в браузере (+7) — разные дни.
 */
const summary = computed(() => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const show = (s?: string) => {
    const d = parse(s)
    return d ? `${pad(d.day)}.${pad(d.month)}.${d.year}` : null
  }
  const a = show(props.from)
  const b = show(props.to)
  if (!a) return null
  return b && b !== a ? `${a} — ${b}` : a
})
</script>

<template>
  <div class="ui-dr">
    <span v-if="label" class="ui-dr__label">{{ label }}</span>
    <output v-if="summary" class="ui-dr__summary">{{ summary }}</output>
    <!-- ⚠️ allow-non-contiguous-ranges: диапазон МОЖЕТ пересекать
         недоступный день. По умолчанию Reka такой выбор запрещает,
         и на витрине кита, где зачёркнуты воскресенья, вторую дату
         нельзя было выбрать за выходным. Аренда с пятницы по вторник
         через закрытое воскресенье — обычный случай проката:
         снаряжение всё это время у клиента, а закрытый день влияет
         на выдачу и приём, а не на срок аренды. -->
    <RangeCalendarRoot
      v-slot="{ weekDays, grid }"
      v-model="value"
      class="ui-dr__root"
      locale="ru-RU"
      :week-starts-on="1"
      :min-value="minValue"
      :max-value="maxValue"
      :is-date-unavailable="isUnavailable"
      allow-non-contiguous-ranges
      weekday-format="short"
      fixed-weeks
      :calendar-label="label ?? 'Период аренды'"
    >
      <RangeCalendarHeader class="ui-dr__head">
        <RangeCalendarPrev class="ui-dr__nav" aria-label="Предыдущий месяц">
          ‹
        </RangeCalendarPrev>
        <RangeCalendarHeading v-slot="{ headingValue }" class="ui-dr__title">
          {{ headingValue }}
        </RangeCalendarHeading>
        <RangeCalendarNext class="ui-dr__nav" aria-label="Следующий месяц">
          ›
        </RangeCalendarNext>
      </RangeCalendarHeader>

      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()" class="ui-dr__grid">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow class="ui-dr__row">
            <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="ui-dr__weekday">
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, i) in month.rows"
            :key="`w-${i}`"
            class="ui-dr__row"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="ui-dr__cell"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="ui-dr__day"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </RangeCalendarRoot>
    <span v-if="hint" class="ui-dr__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.ui-dr {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-dr__summary {
  font-size: var(--font-size-control, 15px);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.ui-dr__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.ui-dr__root {
  background: var(--bg-surface);
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ui-dr__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ui-dr__nav {
  width: var(--control-h-sm);
  height: var(--control-h-sm);
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  font: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.ui-dr__nav:disabled {
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.ui-dr__title {
  font-size: 14px;
  font-weight: 700;
  /* Intl отдаёт «январь 2026» со строчной — заголовок месяца выглядит
     обрубком, поэтому первая буква поднимается стилем, а не строкой:
     в другой локали правило регистра другое. */
  text-transform: capitalize;
}

.ui-dr__grid {
  width: 100%;
  border-collapse: collapse;
}

.ui-dr__row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.ui-dr__weekday {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  padding-bottom: var(--space-2);
}

.ui-dr__cell {
  padding: 1px;
}

.ui-dr__day {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  min-height: 36px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font: inherit;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  cursor: pointer;
}

.ui-dr__day:hover:not([data-disabled]):not([data-unavailable]) {
  background: var(--bg-subtle);
}

/* Дни соседних месяцев показываются, но приглушены: без них сетка
   прыгает по высоте от месяца к месяцу. */
.ui-dr__day[data-outside-view] {
  color: var(--text-tertiary);
}

/* ⚠️ Недоступный день ЗАЧЁРКНУТ, а не просто бледен: бледность
   читается как «неактивная неделя», и клиент жмёт по нему повторно,
   решив, что не попал. */
.ui-dr__day[data-unavailable] {
  color: var(--text-tertiary);
  text-decoration: line-through;
  cursor: not-allowed;
}

.ui-dr__day[data-disabled] {
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.ui-dr__day[data-highlighted],
.ui-dr__day[data-selected] {
  background: var(--brand-subtle);
  color: var(--text-primary);
}

.ui-dr__day[data-selection-start],
.ui-dr__day[data-selection-end] {
  background: var(--bg-brand);
  color: var(--brand-fg);
  font-weight: 700;
}

/* Сегодня — точкой под числом, а не заливкой: заливка спорит
   с выбранным днём, и на границе периода непонятно, что показано. */
.ui-dr__day[data-today]::after {
  content: '';
  position: absolute;
  bottom: 5px;
  width: 3px;
  height: 3px;
  border-radius: var(--radius-full);
  background: currentcolor;
}

.ui-dr__hint {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
