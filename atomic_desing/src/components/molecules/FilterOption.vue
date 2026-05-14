<script setup>
import Checkbox from '../atoms/Checkbox.vue';
import Label from '../atoms/Label.vue';
</script>

<template>
  <div class="filter-option">
    <Checkbox />
    <Label><slot></slot></Label>
  </div>
</template>

<style scoped>
.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
}
</style>
