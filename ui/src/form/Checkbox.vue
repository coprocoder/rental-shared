<script setup lang="ts">
import { useId } from 'vue'
/** Флажок (Input). */
defineProps<{ modelValue?: boolean, label?: string, disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
const id = useId()
</script>

<template>
  <label class="ui-check" :for="id">
    <input
      :id="id"
      type="checkbox"
      class="ui-check__el"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <span class="ui-check__text"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.ui-check {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text-secondary);
  cursor: pointer;
}

.ui-check__el {
  width: 20px;
  height: 20px;
  accent-color: var(--brand);
  flex-shrink: 0;
  margin: 0;
  cursor: pointer;
}

.ui-check__text {
  padding-top: 1px;
}
</style>
