import { computed, watchEffect } from 'vue'
import { uiRef } from './state'

/**
 * Светлая или тёмная тема интерфейса — личная настройка этого браузера.
 *
 * ⚠️ Хранится ТОЛЬКО локально, на сервер не уходит. Тема проката
 * (`admin/theme`) — это оформление для всех его сотрудников и клиентов,
 * а оформление здесь выбирает человек для себя: на стойке у окна и в
 * подсобке без окон удобно разное. Смешивать их на одном экране значило
 * бы обещать «включил тёмную — у коллеги тоже», чего не происходит.
 *
 * ⚠️ Начальное значение — системное, дальше выбор фиксируется. Пока
 * человек не нажимал переключатель, идём за настройкой ОС; после
 * нажатия остаётся выбранное, даже если ОС переключилась. Нажатие —
 * это и есть «я хочу вот так, несмотря на систему».
 *
 * ⚠️ Каждое обращение к localStorage обёрнуто в try: в приватном режиме
 * и при запрете сайту хранить данные сам доступ к свойству бросает
 * исключение (как в useFormDraft). Настройка оформления — удобство,
 * из-за неё экран падать не должен.
 *
 * ⚠️ Атрибут ставится ЗДЕСЬ, а не через `useHead`, и это не
 * непоследовательность. У `useHead` `onUnmounted` снимает все тронутые
 * атрибуты — для плотности это правильно (админка не должна наследовать
 * плотность стойки), а оформление глобально и переживает любой
 * компонент: снятие атрибута означало бы прыжок в светлую при уходе
 * с экрана.
 *
 * ⚠️ Первая отрисовка — на скрипте в `index.html`, не здесь: композабл
 * работает после монтирования, то есть уже после первого кадра, и без
 * скрипта тёмная тема мигала бы белым при каждой загрузке. Ключ
 * продублирован там намеренно — импорт модуля в блокирующем скрипте
 * свёл бы на нет его смысл. Тест держит два места в согласии.
 */

/** Тот же литерал, что в скрипте начальной отрисовки в `index.html`. */
export const APPEARANCE_KEY = 'rental:appearance'

export type Appearance = 'light' | 'dark'

function systemPrefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  catch {
    return false
  }
}

function stored(): Appearance | null {
  try {
    const raw = localStorage.getItem(APPEARANCE_KEY)
    return raw === 'light' || raw === 'dark' ? raw : null
  }
  catch {
    return null
  }
}

export function useAppearance() {
  const appearance = uiRef<Appearance>(
    'appearance',
    () => stored() ?? (systemPrefersDark() ? 'dark' : 'light'),
  )

  const isDark = computed(() => appearance.value === 'dark')

  function setAppearance(next: Appearance): void {
    appearance.value = next
    try {
      localStorage.setItem(APPEARANCE_KEY, next)
    }
    catch {
      // Выбор всё равно подействует на текущую страницу — просто
      // не переживёт перезагрузку.
    }
  }

  /**
   * Переключить на противоположное.
   *
   * ⚠️ Нужен отдельно от `setAppearance`, потому что переключатель —
   * ОДНА кнопка с иконкой, а не выбор из двух: ей нечего передавать,
   * у неё есть только «не так, как сейчас». Два состояния вместо трёх
   * (светлая / тёмная / системная) — решение продукта: системная живёт
   * как НАЧАЛЬНОЕ значение, а не как третье положение, иначе
   * пользователю надо объяснять разницу между «светлая» и «системная,
   * которая сейчас светлая».
   */
  function toggle(): void {
    setAppearance(appearance.value === 'dark' ? 'light' : 'dark')
  }

  watchEffect(() => {
    if (typeof document === 'undefined') return
    if (appearance.value === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    else {
      document.documentElement.removeAttribute('data-theme')
    }
  })

  return { appearance, isDark, setAppearance, toggle }
}
