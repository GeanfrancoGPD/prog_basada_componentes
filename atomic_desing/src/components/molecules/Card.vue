<script setup>
import Button from "../atoms/Button.vue";

defineProps({
  category: {
    type: String,
    default: "Category",
  },
  name: {
    type: String,
    default: "Name",
  },
  price: {
    type: String,
    default: "Price",
  },
});
</script>
<template>
  <div class="card">
    <img
      src="../../assets/img/reloj.png"
      alt="Card Image"
      width="100%"
      height="180"
    />
    <div class="card-content">
      <p>{{ category }}</p>
      <h2>{{ name }}</h2>
    </div>
    <div class="card-footer">
      <p>${{ price }}</p>
      <Button name="Comprar"></Button>
    </div>
  </div>
</template>
<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  width: 240px;
  height: 340px;
  overflow: hidden;
}

.card-content {
  margin-top: 10px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: var(--text-a);
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
