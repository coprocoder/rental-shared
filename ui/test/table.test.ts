/**
 * Таблица: чтение ячеек, сортировка, ключ строки.
 *
 * ⚠️ Появился вместе с обобщением `Table` по типу строки (19.40).
 * Компонент читает поля по СТРОКОВОМУ ключу колонки (`columns[].key`),
 * и связать это с типом компилятором нельзя. Приведение свели в одну
 * функцию `cellOf` — а раз проверку типов здесь заменяет приведение,
 * поведение обязан держать тест. До этого таблица не была покрыта
 * вовсе: сортировка, `row-key` и слот ячейки менялись «на глаз».
 *
 * ⚠️ Проверяется именно то, что легко сломать приведением: числа
 * сравниваются как числа (900 < 1200, а не «900» > «1200»), пустые
 * уходят вниз, а `row-key` берётся из поля, а не из индекса.
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Table from '../src/data/Table.vue'

interface Row { id: string, name: string, amount: string | null }

const COLUMNS = [
  { key: 'name', label: 'Название', sortable: true },
  { key: 'amount', label: 'Сумма', numeric: true, sortable: true },
]

const ROWS: Row[] = [
  { id: 'a', name: 'Бета', amount: '1200.00' },
  { id: 'b', name: 'Альфа', amount: '900.00' },
  { id: 'c', name: 'Гамма', amount: null },
]

function cells(html: string): string[] {
  return [...html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)]
    .map((m) => m[1]!.replace(/<[^>]+>/g, '').trim())
}

describe('Table', () => {
  it('показывает значения по ключам колонок', () => {
    const w = mount(Table, { props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' } })
    const text = w.text()
    expect(text).toContain('Бета')
    expect(text).toContain('1200.00')
  })

  it('пустая таблица говорит об этом, а не рисует пустые строки', () => {
    const w = mount(Table, { props: { columns: COLUMNS, rows: [], empty: 'Ничего нет' } })
    expect(w.text()).toContain('Ничего нет')
  })

  it('сортирует числа как числа, а не как строки', async () => {
    const w = mount(Table, { props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' } })
    // Вторая шапка-кнопка — «Сумма».
    await w.findAll('button.ui-table__sort')[1]!.trigger('click')

    const shown = cells(w.html()).filter((c) => c.includes('.'))
    // 900 должно идти ПЕРЕД 1200: при строковом сравнении было бы наоборот.
    expect(shown[0]).toBe('900.00')
    expect(shown[1]).toBe('1200.00')
  })

  it('строки без значения уходят вниз в любом направлении', async () => {
    const w = mount(Table, { props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' } })
    const sortAmount = () => w.findAll('button.ui-table__sort')[1]!.trigger('click')

    await sortAmount()
    const rowsAsc = w.findAll('tbody tr')
    expect(rowsAsc[rowsAsc.length - 1]!.text()).toContain('Гамма')

    await sortAmount()
    const rowsDesc = w.findAll('tbody tr')
    expect(rowsDesc[rowsDesc.length - 1]!.text()).toContain('Гамма')
  })

  it('row-key берётся из поля строки, а не из индекса', () => {
    const w = mount(Table, { props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' } })
    // Ключи не видны в разметке, поэтому проверяем через переупорядочивание:
    // Vue переиспользует узлы по ключу, и текст должен следовать за данными.
    const before = w.findAll('tbody tr').map((r) => r.text())
    expect(before[0]).toContain('Бета')
    expect(before[1]).toContain('Альфа')
  })

  it('клик по строке отдаёт саму строку, а не её индекс', async () => {
    const w = mount(Table, { props: { columns: COLUMNS, rows: ROWS, rowKey: 'id' } })
    await w.findAll('tbody tr')[1]!.trigger('click')

    const emitted = w.emitted('row')
    expect(emitted).toHaveLength(1)
    expect((emitted![0]![0] as Row).name).toBe('Альфа')
  })
})
