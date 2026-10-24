<script setup lang="ts">
import {  } from 'vue'
/**
 * Модальное окно (Layout).
 *
 * ⚠️ Поведение — Reka Dialog: фокус-трап, возврат фокуса на открывший
 * элемент, закрытие по Escape, aria-modal и скрытие остального дерева
 * от скринридера. Писать это руками — недели работы и годы багов
 * (25-дизайн-система.md).
 *
 * ⚠️ На стойке модальные окна применяются экономно: они перекрывают
 * контекст, а там на позицию отведено десять секунд (24-стойка.md).
 * Подтверждение с причиной — оправданный случай, «вы уверены?» — нет.
 */
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

defineProps<{ title?: string, description?: string }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="ui-modal__overlay" />
      <DialogContent class="ui-modal">
        <DialogTitle v-if="title" class="ui-modal__title">{{ title }}</DialogTitle>
        <DialogDescription v-if="description" class="ui-modal__desc">
          {{ description }}
        </DialogDescription>
        <div class="ui-modal__body"><slot /></div>
        <div v-if="$slots.footer" class="ui-modal__foot"><slot name="footer" /></div>
        <DialogClose class="ui-modal__x" aria-label="Закрыть">×</DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.ui-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgb(16 24 32 / 45%);
  z-index: 40;
}

.ui-modal {
  position: fixed;
  z-index: 41;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(560px, calc(100vw - 32px));
  /* ⚠️ Ограничение по высоте с прокруткой внутри: без него длинная
     форма на телефоне уезжает под экран, и кнопка подтверждения
     становится недоступной. */
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  box-shadow: 0 12px 40px rgb(16 24 32 / 18%);
}

.ui-modal__title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ui-modal__desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.ui-modal__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.ui-modal__foot {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.ui-modal__x {
  position: absolute;
  top: var(--space-5);
  right: var(--space-5);
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.ui-modal__x:hover {
  background: var(--bg-subtle);
}
</style>
