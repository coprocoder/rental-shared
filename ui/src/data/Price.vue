<script setup lang="ts">
import { computed } from 'vue'
/**
 * Цена (Output).
 *
 * ⚠️ Пара «значение + единица» на общей базовой линии — приём, взятый
 * из большого проекта: крупное число с меньшим суффиксом читается
 * быстрее, чем «1 200 ₽» одним кеглем, потому что глаз цепляется за
 * цифры, а не за символ валюты.
 *
 * ⚠️ Сумма приходит СТРОКОЙ и строкой же форматируется. Деньги в БД —
 * numeric (железное правило №3), и превращать их в JS-число по дороге
 * нельзя: 0.1 + 0.2 в двоичной плавающей точке даёт 0.30000000000000004,
 * и на длинном заказе разница вылезает в чек.
 */
const props = withDefaults(defineProps<{
  /** numeric из БД как строка: «1200.00». */
  amount: string | number
  currency?: string
  size?: 'lg' | 'md' | 'sm'
  /** Приписка после суммы: «/день», «за 3 дня». */
  unit?: string
}>(), { currency: '₽', size: 'md' })

/**
 * Разряды пробелами, копейки — только если они есть.
 *
 * ⚠️ Через Intl, а не регуляркой: в другой локали разделитель разрядов
 * другой, и «1 200» станет «1,200» без правок кода.
 */
const formatted = computed(() => {
  const n = Number(props.amount)
  if (!Number.isFinite(n)) return String(props.amount)
  const hasKopecks = Math.round(n * 100) % 100 !== 0
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: hasKopecks ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n)
})
</script>

<template>
  <span :class="['ui-price', `ui-price--${size}`]">
    <span class="ui-price__value num">{{ formatted }}</span>
    <span class="ui-price__unit">{{ currency }}{{ unit ? ` ${unit}` : '' }}</span>
  </span>
</template>

<style scoped>
.ui-price {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  white-space: nowrap;
}

.ui-price__value {
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.ui-price__unit {
  font-weight: 600;
  color: var(--text-secondary);
}

.ui-price--lg .ui-price__value { font-size: 26px; }
.ui-price--lg .ui-price__unit { font-size: 14px; }
.ui-price--md .ui-price__value { font-size: 17px; }
.ui-price--md .ui-price__unit { font-size: 11px; }
.ui-price--sm .ui-price__value { font-size: 14px; }
.ui-price--sm .ui-price__unit { font-size: 10px; }
</style>
