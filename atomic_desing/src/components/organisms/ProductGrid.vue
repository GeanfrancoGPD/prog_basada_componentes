<script setup>
import Card from "../molecules/Card.vue";
</script>
<template>
  <div class="ProductGrid">
    <div v-for="item in 10" :key="item.id">
      <Card :category="item.category" :name="item.name" :price="item.price" />
    </div>
  </div>
</template>
<style scoped>
.ProductGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
