<script setup lang="ts">
/**
 * Метка состояния (Output).
 *
 * ⚠️ Тон подбирается по СМЫСЛУ статуса, а не цветом на вкус вызывающего:
 * иначе «просрочен» в списке заказов и в карточке окажутся разного цвета,
 * и сотрудник перестанет доверять цвету вообще.
 */
withDefaults(defineProps<{
  tone?: 'neutral' | 'brand' | 'ok' | 'warn' | 'danger'
}>(), { tone: 'neutral' })
</script>

<template>
  <span :class="['ui-badge', `ui-badge--${tone}`]"><slot /></span>
</template>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.ui-badge--neutral {
  background: var(--bg-subtle);
  color: var(--text-secondary);
}

.ui-badge--brand {
  background: var(--bg-brand-subtle);
  color: var(--text-brand);
}

.ui-badge--ok {
  background: var(--bg-ok-subtle);
  color: var(--text-ok);
}

.ui-badge--warn {
  background: var(--bg-warn-subtle);
  color: var(--text-warn);
}

.ui-badge--danger {
  background: var(--bg-danger-subtle);
  color: var(--text-danger);
}
</style>
