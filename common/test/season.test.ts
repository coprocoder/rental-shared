/**
 * Сезон категории: месяц и граница года.
 *
 * ⚠️ Решение «в сезоне ли» принимается в поясе ФИЛИАЛА: в 23:30 по
 * Москве 31 мая в Красноярске уже июнь, и летний сапборд должен
 * открыться там, где его выдают.
 */
import { describe, expect, it } from 'vitest'
import { describeSeason, monthInSeason, seasonAllows } from '../src/season.js'

describe('сезон', () => {
  it('без границ — круглый год', () => {
    expect(monthInSeason(7, { fromMonth: null, toMonth: null })).toBe(true)
    expect(describeSeason({ fromMonth: null, toMonth: null })).toBe('круглый год')
  })

  it('внутри года: май–сентябрь', () => {
    const summer = { fromMonth: 5, toMonth: 9 }
    expect([4, 5, 9, 10].map((m) => monthInSeason(m, summer))).toEqual([false, true, true, false])
  })

  it('через Новый год: ноябрь–апрель', () => {
    const winter = { fromMonth: 11, toMonth: 4 }
    expect([10, 11, 1, 4, 5].map((m) => monthInSeason(m, winter))).toEqual([false, true, true, true, false])
    expect(describeSeason(winter)).toBe('ноя–апр')
  })

  it('месяц берётся в поясе филиала', () => {
    // 31 мая 23:30 по Москве = 1 июня 03:30 в Красноярске.
    const at = new Date('2026-05-31T20:30:00Z')
    const summer = { fromMonth: 6, toMonth: 8 }
    expect(seasonAllows(at, summer, 'Europe/Moscow')).toBe(false)
    expect(seasonAllows(at, summer, 'Asia/Krasnoyarsk')).toBe(true)
  })
})
