<script setup>
import { ref, computed } from "vue";

const lista = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

const searchQuery = ref("");

const filteredItems = computed(() => {
  return lista.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});
</script>

<template>
  <input
    type="search"
    class="searchbar"
    placeholder="🔍 Search..."
    list="items"
    v-model="searchQuery"
  />
  <datalist id="items">
    <option v-for="item in filteredItems" :key="item.id" :value="item.name" />
  </datalist>
</template>

<style scoped>
.searchbar {
  background: #cfcccc37;
  border: none;
  border-radius: var(--border-radius);
  padding: 10px 20px;
  color: var(--text);
  outline: none;
}

.searchbar:hover {
  color: var(--text);
}
</style>
