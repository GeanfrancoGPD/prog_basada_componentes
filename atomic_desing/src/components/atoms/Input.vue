<script ></script>

<template>
    <input type="text" class="input" placeholder="Input" />
</template>

<style scoped>
.input {
  background: var(--bg-component);
  color: var(--color-component);
  border: var(--border-component);
  border-radius: var(--border-radius);
  padding: 10px 20px;
  cursor: pointer;
}

.input:focus {
  background: var(--bg-component);
  color: var(--color-component);
  border: var(--border-component-hover);
  transition: var(--transition);
  transform: translateY(-4px);
}


</style>