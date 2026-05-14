<script setup>
defineProps({
  min: {
    type: [Number, String],
    default: 0
  },
  max: {
    type: [Number, String],
    default: 100
  },
  step: {
    type: [Number, String],
    default: 1
  }
})
</script>

<template>
  <div class="range-slider-container">
    <input 
      type="range" 
      class="range-slider" 
      :min="min" 
      :max="max" 
      :step="step"
    />
  </div>
</template>

<style scoped>
.range-slider-container {
  width: 100%;
}

.range-slider {
  width: 100%;
  accent-color: var(--text, #333);
  cursor: pointer;
}

/* Estilos adicionales para asegurar que se vea bien en varios navegadores */
.range-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: var(--border-component, #ddd);
  border-radius: 3px;
}

.range-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  background: var(--border-component, #ddd);
  border-radius: 3px;
}
</style>
