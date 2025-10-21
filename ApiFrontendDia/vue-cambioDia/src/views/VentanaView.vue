<!-- src/views/VentanaView.vue -->
<template>
  <div class="ventana-page">
    <div class="container">
      <Ventana />
    </div>
  </div>
</template>

<script setup lang="ts">
import Ventana from '../components/Ventana.vue'
</script>

<style scoped>
.ventana-page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .ventana-page {
    padding: 1rem 0;
    align-items: flex-start;
  }
}
</style>