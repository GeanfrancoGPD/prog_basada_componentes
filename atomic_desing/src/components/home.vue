<script setup>
import { ref } from 'vue'
import Button from './atoms/Button.vue'
import Input from './atoms/Input.vue';
import Label from './atoms/Label.vue';
import Checkbox from './atoms/Checkbox.vue';
import Searhbar from './molecules/Searhbar.vue';
</script>

<template>
  <h1>Home</h1>
  <h2>Atoms</h2>
  <section>
    <Button />
    <Input />
    <Label />
    <Checkbox />
  </section>
  <slot></slot>
  <h2>Moléculas</h2>
  <section>
    <Searhbar />
  </section>
</template>
