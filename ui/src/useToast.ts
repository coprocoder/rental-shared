import { uiRef } from './state'
/**
 * Очередь всплывающих сообщений (Feedback).
 *
 * ⚠️ Состояние — в `uiRef` (state.ts): одна очередь на всё приложение,
 * сбрасываемая между тестами.
 *
 * ⚠️ Toast только для сообщений, которые НЕ требуют действия и не
 * страшно пропустить («сохранено», «ссылка скопирована»). Ошибка формы
 * и предупреждение о нехватке инвентаря показываются Message
 * в потоке страницы: всплывашка исчезает раньше, чем её прочитали, а на
 * стойке сотрудник в этот момент смотрит на клиента, а не на экран.
 */
export interface Toast {
  id: number
  tone: 'info' | 'ok' | 'warn' | 'danger'
  text: string
}

export function useToast() {
  const toasts = uiRef<Toast[]>('ui:toasts', () => [])

  function push(text: string, tone: Toast['tone'] = 'info', ms = 4000) {
    const id = Date.now() + Math.random()
    toasts.value = [...toasts.value, { id, tone, text }]
    // ⚠️ Раньше таймер ставился только на клиенте (на сервере он удержал
    // бы отрисовку). В SPA сервера нет — проверка стала лишней.
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, ms)
  }

  return {
    toasts,
    push,
    ok: (t: string) => push(t, 'ok'),
    warn: (t: string) => push(t, 'warn'),
    // Ошибка висит дольше: её надо успеть прочитать и понять.
    fail: (t: string) => push(t, 'danger', 7000),
    dismiss: (id: number) => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    },
  }
}
