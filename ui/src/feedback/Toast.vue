<script setup lang="ts">
import { useToast } from '../useToast'
/**
 * Стек всплывающих сообщений (Feedback).
 *
 * Ставится один раз в макет; содержимое приходит из useToast().
 */
const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="ui-toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="ui-toast" :class="`ui-toast--${t.tone}`">
      <span>{{ t.text }}</span>
      <button type="button" class="ui-toast__x" aria-label="Скрыть" @click="dismiss(t.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.ui-toasts {
  position: fixed;
  z-index: 60;
  left: 50%;
  transform: translateX(-50%);
  /* ⚠️ Снизу, а не сверху: на стойке верх экрана занят строкой поиска,
     а снизу сообщение попадает в поле зрения, не перекрывая работу.
     safe-area — чтобы на телефоне не уехало под системную полосу. */
  bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: min(420px, calc(100vw - 32px));
  pointer-events: none;
}

.ui-toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius);
  font-size: 13px;
  line-height: 1.45;
  background: var(--bg-invert);
  color: var(--text-invert);
  box-shadow: 0 6px 24px rgb(16 24 32 / 22%);
}

.ui-toast--ok { background: var(--text-ok); color: #fff; }
.ui-toast--warn { background: var(--text-warn); color: #fff; }
.ui-toast--danger { background: var(--text-danger); color: #fff; }

.ui-toast__x {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
}
</style>
