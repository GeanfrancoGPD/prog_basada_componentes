<script setup>
import { ref, computed } from "vue";
import HomeProduct from "../templates/HomeProduct.vue";

// Generar 25 productos de prueba (simular backend)
const allProducts = ref(Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  category: ['Electronics', 'Accessories', 'Clothing'][Math.floor(Math.random() * 3)],
  name: `Producto ${i + 1}`,
  price: Math.floor(Math.random() * (1000 - 50 + 1)) + 50 // Precios entre 50 y 1000
})));

// Estado de paginación y ordenamiento
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortOrder = ref('asc'); // 'asc' o 'desc'

// Ejecuta paginación
const processedProducts = computed(() => {
  let sorted = [...allProducts.value].sort((a, b) => {
    if (sortOrder.value === 'asc') return a.price - b.price;
    return b.price - a.price;
  });

  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sorted.slice(start, end);
});

const totalPages = computed(() => Math.ceil(allProducts.value.length / itemsPerPage.value));

const handlePageChange = (page) => {
  currentPage.value = page;
  // Hace scroll hacia arriba al cambiar de página
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <HomeProduct 
    :products="processedProducts"
    :total-items="allProducts.length"
    :items-per-page="itemsPerPage"
    v-model:current-page="currentPage"
    v-model:sort-order="sortOrder"
    :total-pages="totalPages"
    @page-changed="handlePageChange"
  />
</template>
