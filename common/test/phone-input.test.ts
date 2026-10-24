/**
 * Проверка телефона: разбор, проверка, маска ввода.
 *
 * ⚠️ Тесты появились из замечания: форма принимала «р8987987987989»
 * телефоном и «нек5476547» почтой, а сообщения об ошибке не показывала
 * вовсе. Пустое поле ошибки под формой — тоже дефект: место было
 * занято, текст не выводился.
 */
import { describe, expect, it } from 'vitest'
import {
  canonicalPhone, caretAfterFormat, formatPhone, isValidPhone, normalizePhone, phoneError,
} from '../src/phone.js'

describe('телефон: разбор', () => {
  it('принимает привычные записи одного номера', () => {
    // Люди пишут все три варианта; отвергать привычную запись — терять заказ.
    for (const v of ['+7 999 123-45-67', '89991234567', '79991234567', '9991234567']) {
      expect(normalizePhone(v), v).toBe('9991234567')
      expect(canonicalPhone(v), v).toBe('+79991234567')
    }
  })

  it('выбрасывает буквы и мусор', () => {
    // Ровно из замечания: «р8987987987989».
    expect(normalizePhone('р8987987987989')).toBe('9879879879')
    expect(normalizePhone('abc')).toBe('')
  })

  it('не даёт набрать больше десяти цифр', () => {
    expect(normalizePhone('8999123456789999')).toHaveLength(10)
  })
})

describe('телефон: проверка', () => {
  it('десять цифр с кодом оператора — валиден', () => {
    expect(isValidPhone('+7 999 123-45-67')).toBe(true)
    expect(isValidPhone('84951234567')).toBe(true)
  })

  it('короткий, длинный и с неверным началом — нет', () => {
    expect(isValidPhone('+7 999 123')).toBe(false)
    expect(isValidPhone('+7 099 123-45-67')).toBe(false)
    expect(isValidPhone('')).toBe(false)
  })

  it('объясняет, что не так', () => {
    expect(phoneError('')).toBeNull()
    expect(phoneError('+7 999')).toMatch(/3 из 10/)
    expect(phoneError('+7 099 123-45-67')).toMatch(/кода оператора/)
    expect(phoneError('+7 999 123-45-67')).toBeNull()
  })
})

describe('телефон: маска', () => {
  it('форматирует по мере набора, не забегая вперёд', () => {
    expect(formatPhone('')).toBe('')
    expect(formatPhone('9')).toBe('+7 9')
    expect(formatPhone('999')).toBe('+7 999')
    expect(formatPhone('999123')).toBe('+7 999 123')
    expect(formatPhone('9991234567')).toBe('+7 999 123-45-67')
  })

  it('каретка не прыгает в конец при правке середины', () => {
    // ⚠️ Без этого поле непригодно для исправления опечатки.
    const raw = '+7 999 13-45-67'
    const formatted = formatPhone(raw)
    // Каретка после «13» — это 5 значащих цифр.
    const pos = caretAfterFormat(raw, 10, formatted)
    expect(pos).toBeGreaterThan(0)
    expect(pos).toBeLessThanOrEqual(formatted.length)
  })
})
