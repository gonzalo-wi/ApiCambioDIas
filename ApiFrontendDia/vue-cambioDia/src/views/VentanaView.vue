<!-- src/views/VentanaView.vue -->
<template>
  <div class="ventana-page">
    <!-- Fondo con olas animadas -->
    <div class="background-waves"></div>
    
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
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.background-waves {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/wave.svg') no-repeat bottom center;
  background-size: cover;
  opacity: 0.1;
  animation: wave-float 6s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes wave-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

.container {
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .ventana-page {
    padding: 1rem 0;
    align-items: flex-start;
  }
}
</style>