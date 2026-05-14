<script setup>
import Header from "../organisms/Header.vue";
import Sidebar from "../organisms/Sidebar.vue";
import ProductGrid from "../organisms/ProductGrid.vue";
import ProductToolbar from "../molecules/ProductToolbar.vue";
import Pagination from "../molecules/Pagination.vue";
import Footer from "../organisms/Footer.vue";

defineProps({
  products: Array,
  totalItems: Number,
  itemsPerPage: Number,
  currentPage: Number,
  sortOrder: String,
  totalPages: Number
})

const emit = defineEmits(['update:currentPage', 'update:sortOrder', 'page-changed'])
</script>
<template>
  <Header />
  <slot name="header"></slot>
  <div class="page-container">
    <Sidebar />
    <main class="main-content">
      <div class="header-content">
        <h1>Productos</h1>
      </div>
      
      <ProductToolbar 
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        :sort-value="sortOrder"
        @update:sortValue="emit('update:sortOrder', $event)"
      />
      
      <ProductGrid :products="products" />
      
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="emit('page-changed', $event)"
      />
    </main>
  </div>
  <Footer />
</template>
<style scoped>
.page-container {
  display: flex;
  padding: 30px;
  align-items: flex-start;
}

.main-content {
  flex: 1;
}

h1 {
  font-size: 30px;
  margin-top: 0;
  margin-bottom: 20px;
  margin-left: 40px;
}
</style>
