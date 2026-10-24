/**
 * Названия статусов и событий заказа — одни на витрине, стойке, в
 * админке и в выгрузке.
 *
 * ⚠️ Неизвестный статус показывается как есть, а не пустой строкой:
 * новый статус на сервере не должен превращаться в пустую ячейку.
 */
import { describe, expect, it } from 'vitest'
import { actorLabel, eventLabel, statusLabel, statusTone } from '../src/order-status.js'

describe('статусы заказа', () => {
  it('известный статус — по-человечески и с тоном', () => {
    expect(statusLabel('overdue')).toBe('Просрочен')
    expect(statusTone('overdue')).toBe('danger')
  })

  it('неизвестный — как есть и нейтрально', () => {
    expect(statusLabel('new_status')).toBe('new_status')
    expect(statusTone('new_status')).toBe('neutral')
  })

  it('событие правки и автор', () => {
    expect(eventLabel('order.updated')).toBe('Заказ изменён')
    expect(actorLabel('customer', null)).toBe('Клиент')
    expect(actorLabel('staff', 'Пётр')).toBe('Пётр')
  })
})
