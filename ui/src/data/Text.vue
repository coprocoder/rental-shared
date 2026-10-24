<script setup lang="ts">
/**
 * Текст (Primitive).
 *
 * Не «обёртка ради обёртки»: держит типографическую шкалу в одном месте.
 * Иначе размеры расползаются по компонентам, и в большом проекте это
 * закончилось захардкоженными пикселями внутри темы.
 */
withDefaults(defineProps<{
  as?: string
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'hint'
  tone?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warn' | 'ok'
}>(), {
  as: 'p',
  variant: 'body',
  tone: 'primary',
})
</script>

<template>
  <component :is="as" :class="['ui-text', `ui-text--${variant}`, `ui-text--${tone}`]">
    <slot />
  </component>
</template>

<style scoped>
.ui-text {
  margin: 0;
}

.ui-text--title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.ui-text--subtitle {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ui-text--body {
  font-size: 14px;
  line-height: 1.5;
}

.ui-text--caption {
  font-size: 12px;
  line-height: 1.45;
}

/* Надпись-рубрика над блоком: капсом, разрядкой, мелко. */
.ui-text--label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ui-text--hint {
  font-size: 11px;
  line-height: 1.45;
}

.ui-text--primary { color: var(--text-primary); }
.ui-text--secondary { color: var(--text-secondary); }
.ui-text--tertiary { color: var(--text-tertiary); }
.ui-text--danger { color: var(--text-danger); }
.ui-text--warn { color: var(--text-warn); }
.ui-text--ok { color: var(--text-ok); }
</style>
