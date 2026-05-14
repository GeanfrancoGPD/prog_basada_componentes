<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
    // Formato esperado: [{ value: 'asc', label: 'Menor a Mayor' }, ...]
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <select 
    class="select-input" 
    :value="modelValue" 
    @change="handleChange"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.select-input {
  background: var(--bg);
  color: var(--text);
  border: var(--border-component);
  border-radius: var(--border-radius);
  padding: 8px 15px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: var(--transition);
}

.select-input:hover, .select-input:focus {
  border: var(--border-component-hover);
}
</style>
