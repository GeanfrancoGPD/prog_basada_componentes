<script setup>
import Header from "../organisms/Header.vue";
import ProductGrid from "../organisms/ProductGrid.vue";
import Footer from "../organisms/Footer.vue";
</script>
<template>
  <Header />
  <slot name="header"></slot>
  <h1>Productos</h1>
  <ProductGrid />
  <Footer />
</template>
<style scoped>
h1 {
  font-size: 30px;
}
</style>
