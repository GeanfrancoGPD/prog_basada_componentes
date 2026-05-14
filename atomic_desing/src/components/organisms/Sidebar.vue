<script setup>
import { ref } from 'vue';
import FilterOption from '../molecules/FilterOption.vue';
import RangeSlider from '../atoms/RangeSlider.vue';
import Button from '../atoms/Button.vue';
import Label from '../atoms/Label.vue';

const defaultPrice = ref(500);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <h3>Categorías</h3>
      <FilterOption>All products</FilterOption>
      <FilterOption>Accessories</FilterOption>
      <FilterOption>Electronics</FilterOption>
      <FilterOption>Clothing</FilterOption>
    </div>

    <div class="sidebar-section">
      <h3>Price range</h3>
      <RangeSlider v-model="defaultPrice" min="0" max="100" step="10" />
      <div class="price-labels">
        <Label>$0</Label>
        <Label>$100</Label>
      </div>
    </div>

    <div class="sidebar-actions">
      <Button name="Aplicar Filtros" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  flex-basis: 15%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius, 8px);
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: fit-content;
}

.sidebar-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: var(--text, #333);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.sidebar-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
