<script setup lang="ts">
// Si NO usas Ventana aquí, puedes eliminar esta línea
// import Ventana from '../components/Ventana.vue'

function abrirVentana() {
  window.open('/ventanaView', 'ventanaCallCenter', 'width=420,height=600')
}
</script>

<template>
  <div class="container">
    <!-- Título -->
    <h1 class="titulo">Bienvenido al Panel de Operaciones</h1>

    
    <img src="../assets/Ivess.png" alt="Logo animado" class="logo" />

    
    <div class="arrow-down">⬇️</div>

    
    <button @click="abrirVentana" class="boton-call">
      📞 Abrir Ventana
    </button>

    
    <p class="texto-secundario">Haz clic en el botón para gestionar cambios de día</p>
  </div>
  <footer class="footer">
    © 2025 El Jumillano. Desarrollado por Gonzalo Wiñazki. Todos los derechos reservados.
  </footer>
</template>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 80vh;
  text-align: center;
  padding: 48px 24px 24px 24px;
  position: relative;
  z-index: 2;
}

/* Ondas de fondo */
.container::before {
  content: '';
  background: url('../assets/wave.svg');
  position: absolute;
  top: 32%;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: bottom;
  background-size: cover;
  animation: wave-animation 10s infinite linear;
  z-index: 1;
}


@keyframes wave-animation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

/* Título */
.titulo {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 50px;
  color: #1f2937;
  z-index: 2;
}

/* Logo */
.logo {
  width: 300px;
  margin-bottom: 16px;
  z-index: 2;
}

/* Flecha animada */
.arrow-down {
  animation: bounce 1s infinite;
  font-size: 2rem;
  margin-bottom: 8px;
  z-index: 2;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

/* Botón */
.boton-call {
  background-color: #2563eb;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  z-index: 2;
}

.boton-call:hover {
  background-color: #1e40af;
}

/* Texto secundario */
.texto-secundario {
  margin-top: 12px;
  color: #555;
  font-size: 0.9rem;
  z-index: 2;
}
.footer {
  width: 100%;
  text-align: center;
  padding: 16px 0;
  color: #fdfdfd;
  font-size: 0.95rem;
  background: transparent;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
}
</style>