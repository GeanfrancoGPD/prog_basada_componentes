<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  min: {
    type: [Number, String],
    default: 0
  },
  max: {
    type: [Number, String],
    default: 1000
  },
  step: {
    type: [Number, String],
    default: 1
  }
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event) => {
  emit('update:modelValue', Number(event.target.value));
};

// Calculamos la posición del bubble basándonos en el porcentaje
const bubblePosition = computed(() => {
  const val = Number(props.modelValue) || 0;
  const min = Number(props.min) || 0;
  const max = Number(props.max) || 0;
  
  const range = max - min;
  
  // Evitar división por cero
  let fraction = range === 0 ? 0 : (val - min) / range;
  
  // Aseguramos que fraction sea un número válido entre 0 y 1
  if (Number.isNaN(fraction)) {
    fraction = 0;
  } else {
    fraction = Math.max(0, Math.min(1, fraction));
  }
  
  const percentage = fraction * 100;
  
  // Ajuste fino para que la burbuja no se desborde en los bordes
  return `calc(${percentage}% + (${8 - percentage * 0.16}px))`;
});
</script>

<template>
  <div class="range-slider-container">
    <div class="slider-wrapper">
      <div 
        class="bubble" 
        :style="{ left: bubblePosition }"
      >
        ${{ modelValue }}
      </div>
      <input 
        type="range" 
        class="range-slider" 
        :min="min" 
        :max="max" 
        :step="step"
        :value="modelValue"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<style scoped>
.range-slider-container {
  width: 100%;
  padding-top: 30px; /* Espacio para la burbuja */
}

.slider-wrapper {
  position: relative;
  width: 100%;
}

.bubble {
  position: absolute;
  top: -30px;
  transform: translateX(-50%);
  background-color: var(--bg-component, #021522);
  color: var(--color-component, #ffffff);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  pointer-events: none; /* Para que no estorbe al hacer clic */
  transition: left 0.1s ease;
  white-space: nowrap;
}

/* El piquito del bubble */
.bubble::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px 5px 0;
  border-style: solid;
  border-color: var(--bg-component, #021522) transparent transparent transparent;
}

.range-slider {
  width: 100%;
  accent-color: var(--text, #333);
  cursor: pointer;
  margin: 0;
}

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
