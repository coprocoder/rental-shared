/**
 * Светлая и тёмная тема интерфейса.
 *
 * ⚠️ Главное, что проверяется, — настройка не имеет права уронить экран.
 * В приватном режиме и при запрете хранить данные сам доступ к
 * `localStorage` бросает исключение, и композабл обязан это проглотить:
 * оформление — удобство, а не условие работы приложения.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { resetUiState } from '../src/state'
import { APPEARANCE_KEY, useAppearance } from '../src/useAppearance'

/** Композабл ставит атрибут через watchEffect — ему нужен живой scope. */
async function withScope<T>(fn: () => T): Promise<T> {
  const scope = effectScope()
  const result = scope.run(fn) as T
  await nextTick()
  return result
}

function setSystemDark(dark: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: dark && query.includes('dark'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

beforeEach(() => {
  resetUiState()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  setSystemDark(false)
})

describe('начальное значение', () => {
  it('пустое хранилище и тёмная ОС — тёмная', async () => {
    setSystemDark(true)

    const { isDark } = await withScope(() => useAppearance())

    expect(isDark.value, 'системная настройка не подхвачена').toBe(true)
  })

  it('пустое хранилище и светлая ОС — светлая', async () => {
    const { isDark } = await withScope(() => useAppearance())

    expect(isDark.value).toBe(false)
  })

  it('сохранённый выбор сильнее настройки ОС', async () => {
    // ⚠️ Смысл фиксации: человек нажал переключатель, и это решение
    // не должно отменяться тем, что ОС вечером ушла в тёмную.
    localStorage.setItem(APPEARANCE_KEY, 'light')
    setSystemDark(true)

    const { isDark } = await withScope(() => useAppearance())

    expect(isDark.value, 'выбор перезатёрт системной настройкой').toBe(false)
  })

  it('мусор в хранилище игнорируется, берётся система', async () => {
    localStorage.setItem(APPEARANCE_KEY, 'не-тема')
    setSystemDark(true)

    const { isDark } = await withScope(() => useAppearance())

    expect(isDark.value).toBe(true)
  })
})

describe('переключение', () => {
  it('ставит и снимает атрибут на корне документа', async () => {
    const { setAppearance } = await withScope(() => useAppearance())

    setAppearance('dark')
    await nextTick()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    setAppearance('light')
    await nextTick()
    // ⚠️ Снимается, а не ставится 'light': светлая — это палитра по
    // умолчанию, отдельного значения для неё в CSS нет.
    expect(
      document.documentElement.hasAttribute('data-theme'),
      'в светлой теме атрибут остался на <html>',
    ).toBe(false)
  })

  it('выбор переживает пересоздание композабла', async () => {
    const first = await withScope(() => useAppearance())
    first.setAppearance('dark')

    const second = await withScope(() => useAppearance())

    expect(second.isDark.value, 'состояние не общее между вызовами').toBe(true)
    expect(localStorage.getItem(APPEARANCE_KEY)).toBe('dark')
  })
})

describe('недоступное хранилище', () => {
  it('чтение бросает — композабл всё равно работает', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => { throw new Error('доступ запрещён') })
    setSystemDark(true)

    const { isDark } = await withScope(() => useAppearance())

    expect(isDark.value, 'не упало, но и систему не прочитало').toBe(true)
    getItem.mockRestore()
  })

  it('запись бросает — выбор действует на текущей странице', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => { throw new Error('доступ запрещён') })

    const { isDark, setAppearance } = await withScope(() => useAppearance())
    expect(() => setAppearance('dark')).not.toThrow()
    await nextTick()

    expect(isDark.value, 'выбор потерян из-за недоступного хранилища').toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    setItem.mockRestore()
  })
})
