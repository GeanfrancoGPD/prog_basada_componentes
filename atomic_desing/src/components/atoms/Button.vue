<script setup>
defineProps({
  name: {
    type: String,
    default: "Button",
  },
});
</script>

<template>
  <button class="btn">{{ name }}</button>
</template>

<style scoped>
.btn {
  background: var(--bg-component);
  color: var(--color-component);
  /* border: var(--border-component); */
  border-radius: var(--border-radius);
  padding: 10px 20px;
  cursor: pointer;
}

.btn:hover {
  background: var(--bg-component);
  color: var(--color-component);
  border: var(--border-component-hover);
  box-shadow: 0px 3px 5px 1px rgba(0,0,0,0.51);
  transition: var(--transition);
  transform: translateY(-4px);
}

.btn:active {
  background: var(--bg-component-hover);
  color: var(--color-component);
  box-shadow: none;
  border: var(--border-component-hover);
  transition: var(--transition);
  transform: translateY(2px);
}
</style>
