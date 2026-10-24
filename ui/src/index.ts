/**
 * @rental/ui — UI-кит проката: компоненты, токены, оформление.
 *
 * Компоненты импортируются по пути (`@rental/ui/form/Button.vue`), токены —
 * `@rental/ui/tokens.css`. Отсюда — только то, что не компонент.
 */
export { useToast, type Toast } from './useToast'
export { APPEARANCE_KEY, useAppearance, type Appearance } from './useAppearance'
export { resetUiState } from './state'
