<template>
    <button class="btn">Button</button>
</template>

<style scoped>
.btn {
  background: var(--bg-component);
  color: var(--color-component);
  border: var(--border-component);
  border-radius: var(--border-radius);
  padding: 10px 20px;
  cursor: pointer;
}

.btn:hover {
  background: var(--bg-component);
  color: var(--color-component);
  border: var(--border-component-hover);
  transition: var(--transition);
  transform: translateY(-4px);
}

.btn:active {
  background: var(--bg-component-hover);
  color: var(--color-component) ;
  border: var(--border-component-hover);
  transition: var(--transition);
  transform: translateY(2px);
}
</style>