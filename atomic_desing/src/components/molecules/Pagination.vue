<script setup>
import { computed } from 'vue';
import Button from '../atoms/Button.vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-changed'])

const pages = computed(() => {
  const p = [];
  for (let i = 1; i <= props.totalPages; i++) {
    p.push(i);
  }
  return p;
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page)
  }
}
</script>

<template>
  <div class="pagination">
    <Button 
      name="Anterior" 
      @click="goToPage(currentPage - 1)" 
      :disabled="currentPage === 1"
      :class="{ 'disabled-btn': currentPage === 1 }"
    />
    
    <div class="page-numbers">
      <button 
        v-for="page in pages" 
        :key="page"
        class="page-number"
        :class="{ 'active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <Button 
      name="Siguiente" 
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      :class="{ 'disabled-btn': currentPage === totalPages }"
    />
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-component);
}

.page-numbers {
  display: flex;
  gap: 10px;
}

.page-number {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border-component);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: var(--transition);
  font-weight: bold;
}

.page-number:hover {
  background: var(--bg-component);
  color: var(--color-component);
}

.page-number.active {
  background: var(--bg-component-hover);
  color: var(--bg);
  border-color: var(--bg-component-hover);
}

.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
