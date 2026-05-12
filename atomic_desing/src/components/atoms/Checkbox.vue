<script></script>
<template>
  <input type="checkbox" class="checkbox" />
</template>

<style scoped>
.checkbox {
    accent-color: var(--text);
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: var(--border-component);
}

.checkbox:hover {
    accent-color: var(--bg-component-hover);
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: var(--border-component-hover);
    transition: var(--transition);
    transform: translateY(-4px);
}
</style>