<script setup lang="ts">
/**
 * Переключатель светлой и тёмной темы (Input).
 *
 * Спека: ../rental-docs/docs/04-тз/20-фронтенд/25-дизайн-система.md
 *
 * ⚠️ ОДНА кнопка с иконкой, а не выбор из двух подписей. Стоит в шапке
 * рядом с именем сотрудника и в шапке витрины, где места нет: `Segmented`
 * с подписями «Светлая» и «Тёмная» занимал 132 px и на узком экране
 * распирал шапку, из-за чего его приходилось скрывать совсем — а
 * скрытый переключатель означал, что на витрине и в обходе системы
 * (iframe 428 px) темы не переключить вовсе.
 *
 * ⚠️ Иконка показывает ЦЕЛЬ нажатия, а не текущее состояние: в светлой
 * теме видна луна («включить тёмную»). Это соглашение большинства
 * сайтов, и оно же снимает вопрос «луна — это сейчас тёмная или станет
 * тёмной». Для скринридера состояние передаётся отдельно, через
 * `aria-pressed`, потому что по иконке его не прочитать.
 *
 * ⚠️ Компонент кита, а не вёрстка в шапке: переключатель нужен в ТРЁХ
 * шапках — админка, витрина, обход системы. Копия разошлась бы на
 * первой правке, а `scripts/check-kit-usage.sh` требует кит на
 * клиентских экранах.
 *
 * ⚠️ Высота из `--control-h`, как у всех контролов кита: на стойке
 * плотность поднимает её до 60 px, и отдельного переключателя «для
 * стойки» быть не должно. Шапка компенсирует размер своим правилом —
 * см. `.shell__theme` в `layouts/staff.vue`.
 */
import { useAppearance } from '../useAppearance'

const { isDark, toggle } = useAppearance()
</script>

<template>
  <button
    type="button"
    class="ui-appearance"
    :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
    :aria-pressed="isDark"
    :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
    @click="toggle"
  >
    <!--
      ⚠️ Иконки встроены, а не из библиотеки: это единственные две
      иконки в проекте, и зависимость ради них несоразмерна. `currentColor`
      обязателен — иначе иконка не последует за цветом темы.
      aria-hidden: смысл несёт aria-label кнопки, иначе скринридер
      прочитает и подпись, и картинку.
    -->
    <svg
      v-if="isDark"
      class="ui-appearance__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
    <svg
      v-else
      class="ui-appearance__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
    </svg>
  </button>
</template>

<style scoped>
.ui-appearance {
  /* Квадрат по высоте контрола: иконка без подписи, растягивать нечего. */
  inline-size: var(--control-h);
  block-size: var(--control-h);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color .15s, color .15s, border-color .15s;
}

.ui-appearance:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

/* ⚠️ :focus-visible, а не :focus — иначе рамка остаётся после щелчка
   мышью, хотя нужна она только при ходьбе с клавиатуры. */
.ui-appearance:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.ui-appearance__icon {
  inline-size: 20px;
  block-size: 20px;
}
</style>
