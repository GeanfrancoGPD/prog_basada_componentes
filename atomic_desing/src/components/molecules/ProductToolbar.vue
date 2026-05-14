<script setup>
import Select from '../atoms/Select.vue';

defineProps({
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  sortValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:sortValue'])

const sortOptions = [
  { value: 'asc', label: 'Menor a Mayor' },
  { value: 'desc', label: 'Mayor a Menor' }
]

const handleSortChange = (newValue) => {
  emit('update:sortValue', newValue)
}
</script>

<template>
  <div class="product-toolbar">
    <div class="toolbar-info">
      <!-- Calculamos el rango mostrado. Ej: Mostrando 1-10 de 25 -->
      Mostrando 
      <strong>{{ (currentPage - 1) * itemsPerPage + 1 }}</strong> - 
      <strong>{{ Math.min(currentPage * itemsPerPage, totalItems) }}</strong> 
      de <strong>{{ totalItems }}</strong> artículos
    </div>
    
    <div class="toolbar-actions">
      <span>Ordenar por:</span>
      <Select 
        :modelValue="sortValue" 
        :options="sortOptions" 
        @update:modelValue="handleSortChange" 
      />
    </div>
  </div>
</template>

<style scoped>
.product-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-component);
  color: var(--text);
  font-size: 14px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

strong {
  color: var(--bg-component-hover);
}
</style>
