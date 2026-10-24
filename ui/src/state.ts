/**
 * Состояние кита, общее для всех его компонентов.
 *
 * ⚠️ Своё, а не `sharedRef` приложения: кит не знает приложения, иначе
 * его нельзя было бы подключить второй витрине. Ключ гарантирует, что
 * два вызова `useToast()` видят ОДНУ очередь, а не две независимые.
 */
import { ref, type Ref } from 'vue'

const registry = new Map<string, Ref<unknown>>()

export function uiRef<T>(key: string, init: () => T): Ref<T> {
  const existing = registry.get(key)
  if (existing) return existing as Ref<T>
  const created = ref(init()) as Ref<T>
  registry.set(key, created as Ref<unknown>)
  return created
}

/**
 * Сбрасывает состояние кита. Нужен тестам: иначе тост или тема,
 * оставленные предыдущим тестом, роняют следующий не по его теме.
 */
export function resetUiState(): void {
  registry.clear()
}
