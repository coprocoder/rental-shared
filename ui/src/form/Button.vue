<script setup lang="ts">
/**
 * Кнопка (Primitive).
 *
 * ⚠️ Высота берётся из --control-h, а не задаётся вариантом: плотность
 * переключается атрибутом на корне (8A.3), и одна и та же кнопка на
 * стойке становится 60 px, а в клиентской форме остаётся 48. Второго
 * набора компонентов «для стойки» не существует и не должно появиться.
 */
import Spinner from '../feedback/Spinner.vue'

withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  /** Во всю ширину — основной режим на телефоне и на стойке. */
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['ui-btn', `ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--block': block }]"
  >
    <Spinner v-if="loading" class="ui-btn__spin" />
    <slot />
  </button>
</template>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  height: var(--control-h);
  padding: 0 var(--space-7);
  border-radius: var(--radius);
  border: 1px solid transparent;
  font: inherit;
  font-size: var(--font-size-control);
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  /* ⚠️ Текст кнопки не переносится и не выделяется: на стойке по кнопке
     бьют пальцем, и долгое нажатие не должно давать выделение текста. */
  white-space: nowrap;
  user-select: none;
}

.ui-btn--block {
  width: 100%;
}

.ui-btn--sm {
  height: var(--control-h-sm);
  padding: 0 var(--space-5);
  font-size: 13px;
}

.ui-btn--primary {
  background: var(--bg-brand);
  color: var(--brand-fg);
}

.ui-btn--primary:hover:not(:disabled) {
  background: var(--brand-hover);
}

.ui-btn--secondary {
  background: var(--bg-surface);
  border-color: var(--stroke-primary);
  color: var(--text-primary);
}

.ui-btn--secondary:hover:not(:disabled) {
  border-color: var(--text-secondary);
}

.ui-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}

.ui-btn--ghost:hover:not(:disabled) {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.ui-btn--danger {
  background: var(--bg-surface);
  border-color: var(--stroke-danger);
  color: var(--text-danger);
}

.ui-btn--danger:hover:not(:disabled) {
  background: var(--bg-danger-subtle);
}

.ui-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ui-btn__spin {
  width: 15px;
  height: 15px;
}
</style>
