<script setup>
import Header from "../organisms/Header.vue";
import Sidebar from "../organisms/Sidebar.vue";
import ProductGrid from "../organisms/ProductGrid.vue";
import Footer from "../organisms/Footer.vue";
</script>
<template>
  <Header />
  <slot name="header"></slot>
  <div class="page-container">
    <Sidebar />
    <main class="main-content">
      <h1>Productos</h1>
      <ProductGrid />
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
