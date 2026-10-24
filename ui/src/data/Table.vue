<script setup lang="ts" generic="Row">
import { computed, ref } from 'vue'
/**
 * Таблица (Output).
 *
 * ⚠️ Настоящий <table>, а не сетка из div: скринридер объявляет
 * заголовок колонки при переходе по ячейкам, а на сетке из div этого
 * не происходит — и «1 200» перестаёт быть суммой.
 *
 * ⚠️ Горизонтальная прокрутка живёт ВНУТРИ обёртки, а не у страницы:
 * иначе список заказов на телефоне уводит вбок всю админку вместе
 * с шапкой.
 *
 * ⚠️ Обобщена по типу строки. Было `rows: Record<string, unknown>[]`,
 * и это не принимало типизированный массив: `Item[]` не подходит под
 * `Record<string, unknown>[]`, потому что индексной подписи у интерфейса
 * нет. Четыре экрана из-за этого приводили свои строки к «объекту с
 * любыми полями» — теряя типы ровно там, где они уже были известны.
 * Слот строки теперь тоже отдаёт `Row`, а не безымянный объект.
 *
 * ⚠️ `Row` БЕЗ ограничения `extends Record<string, unknown>`: с ним
 * ничего не менялось — ограничение требует ту же индексную подпись,
 * которой у интерфейсов экранов нет. Доступ по ключу колонки внутри
 * идёт через явное приведение в одном месте (`cellOf`), а не в каждом
 * из четырёх экранов.
 */
const props = defineProps<{
  /** `sortable` включает сортировку по клику на шапку этой колонки. */
  columns: {
    key: string
    label: string
    numeric?: boolean
    width?: string
    sortable?: boolean
    /**
     * Колонка по содержимому: чекбокс, иконка, одна кнопка.
     *
     * ⚠️ Снимает `min-width`, который иначе растягивает столбец до
     * 84px (а первый — до 140px). Для колонки выбора это полсантиметра
     * пустоты перед каждой строкой, и глаз теряет связь галочки с её
     * строкой.
     */
    narrow?: boolean
  }[]
  rows: Row[]
  rowKey?: string
  empty?: string
}>()

const emit = defineEmits<{ row: [Row] }>()

/**
 * Сортировка живёт В ТАБЛИЦЕ, а не в каждом экране.
 *
 * ⚠️ Сортируется ЗАГРУЖЕННАЯ страница, а не вся выборка. Список
 * заказов листается курсором по (created_at, id) — просить у сервера
 * другой порядок значило бы ломать пагинацию. Это честное поведение
 * для страницы в 50 строк и оно не притворяется сортировкой по базе.
 */
const sortKey = ref<string | null>(null)
const sortAsc = ref(true)

function toggleSort(key: string) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

/**
 * Значение ячейки по ключу колонки.
 *
 * ⚠️ Единственное место, где строка читается «по строковому ключу»:
 * колонки описаны данными (`columns[].key`), и связать их с полями
 * типа компилятором нельзя — ключ приходит из массива, а не из типа.
 * Приведение сидит здесь одно, вместо четырёх приведений в экранах.
 */
function cellOf(row: Row, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

const sorted = computed(() => {
  const key = sortKey.value
  if (!key) return props.rows
  const dir = sortAsc.value ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const x = cellOf(a, key), y = cellOf(b, key)
    if (x == null && y == null) return 0
    // Пустые всегда внизу: строка без значения не «самая ранняя».
    if (x == null) return 1
    if (y == null) return -1
    // Числа и деньги («2400.00») сравниваем как числа, не как строки:
    // иначе 900 оказывается больше 1200.
    const nx = Number(x), ny = Number(y)
    if (Number.isFinite(nx) && Number.isFinite(ny) && String(x).trim() !== '') {
      return (nx - ny) * dir
    }
    return String(x).localeCompare(String(y), 'ru') * dir
  })
})
</script>

<template>
  <div class="ui-table-wrap">
    <table class="ui-table">
      <thead>
        <tr>
          <th
            v-for="c in columns"
            :key="c.key"
            :style="c.width ? { width: c.width } : undefined"
            :class="{ 'ui-table__num': c.numeric, 'ui-table__narrow': c.narrow }"
            scope="col"
            :aria-sort="sortKey === c.key ? (sortAsc ? 'ascending' : 'descending') : undefined"
          >
            <!-- Кнопка, а не обработчик на th: сортировка должна
                 срабатывать с клавиатуры и объявляться скринридером. -->
            <button
              v-if="c.sortable"
              type="button"
              class="ui-table__sort"
              @click="toggleSort(c.key)"
            >
              {{ c.label }}
              <span aria-hidden="true">{{ sortKey === c.key ? (sortAsc ? '↑' : '↓') : '↕' }}</span>
            </button>
            <!-- ⚠️ Слот для заголовка, а не только для ячеек: колонке
                 выбора нужен «выбрать все» в шапке, и без слота он
                 рисуется отдельным элементом рядом с таблицей, где
                 связь со столбцом теряется. -->
            <slot v-else :name="`header-${c.key}`">{{ c.label }}</slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!sorted.length">
          <td :colspan="columns.length" class="ui-table__empty">
            {{ empty ?? 'Пусто' }}
          </td>
        </tr>
        <tr
          v-for="(r, i) in sorted"
          :key="String(rowKey ? cellOf(r, rowKey) : i)"
          class="ui-table__row"
          @click="emit('row', r)"
        >
          <td
            v-for="c in columns"
            :key="c.key"
            :class="{ 'ui-table__num num': c.numeric, 'ui-table__narrow': c.narrow }"
          >
            <slot :name="`cell-${c.key}`" :row="r" :value="cellOf(r, c.key)">{{ cellOf(r, c.key) }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Шапка-кнопка выглядит как шапка, но ведёт себя как кнопка. */
.ui-table__sort {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: inherit;
  cursor: pointer;
}

.ui-table__sort:hover {
  color: var(--text-primary);
}

.ui-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
}

.ui-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

/*
  ⚠️ Ячейка не ужимается уже читаемого. Без этого браузер раздаёт
  ширину по содержимому, и таблица с полями ввода «едет»: числовое
  поле растягивает свою колонку, соседние схлопываются в две буквы.
  Заметно на прайсе (6 колонок с полями) и в отчётах (17 колонок).
  Контейнер и так прокручивается по горизонтали — пусть лучше будет
  прокрутка, чем нечитаемые столбцы.
*/
.ui-table th,
.ui-table td {
  min-width: 84px;
}

/* Первая колонка — обычно название: ей нужно больше. */
.ui-table th:first-child,
.ui-table td:first-child {
  min-width: 140px;
}

/* ⚠️ Специфичность: правило идёт ПОСЛЕ :first-child и повторяет
   `.ui-table` в селекторе, иначе колонка выбора, стоящая первой,
   осталась бы растянутой на 140px. */
.ui-table th.ui-table__narrow,
.ui-table td.ui-table__narrow {
  min-width: 0;
  width: 1px;
  white-space: nowrap;
  /* Отступ справа такой же, как слева: галочка стоит по центру
     своей колонки, а не прижата к соседнему столбцу. */
  padding-left: var(--space-5);
  padding-right: var(--space-5);
}

.ui-table th {
  text-align: left;
  padding: var(--space-4) var(--space-5);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--stroke-subtle);
  white-space: nowrap;
}

.ui-table td {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--stroke-subtle);
  color: var(--text-primary);
  /* ⚠️ top, а не middle: в таблице с полями ввода ячейки разной высоты
     («Действует» — два поля с подсказками, соседние — одно), и при
     центрировании поля в соседних колонках не совпадают по вертикали.
     Читается это именно как «колонки съехали относительно шапки». */
  vertical-align: top;
}

.ui-table tbody tr:last-child td {
  border-bottom: none;
}

.ui-table__row:hover td {
  background: var(--bg-subtle);
}

/*
  ⚠️ Селектор перечисляет th и td ЯВНО, а не полагается на один класс.
  `.ui-table th { text-align: left }` весит больше, чем `.ui-table__num`,
  и перебивал его: заголовок «Сумма» вставал слева, а числа под ним —
  справа, и это читалось как «колонки съехали». На td правило работало,
  потому что конкурента у него нет, — из-за чего расхождение и вышло
  видимым только в шапке.
*/
.ui-table th.ui-table__num,
.ui-table td.ui-table__num {
  text-align: right;
}

/* ⚠️ Шапка-кнопка в числовой колонке прижимается вправо вместе
   со значением. Без этого inline-flex центрируется внутри ячейки,
   и заголовок «Сумма» стоит по центру, а числа под ним — справа:
   на глаз это и читается как «колонки съехали». */
.ui-table__num .ui-table__sort {
  justify-content: flex-end;
  width: 100%;
}

.ui-table__empty {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--space-9) var(--space-5);
}
</style>
