<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function abrirVentana() {
  window.open('/ventanaView', 'ventanaCallCenter', 'width=420,height=600')
}

function irAdjuntos() {
  router.push('/adjuntos')
}
</script>

<template>
  <div class="home-container">
    <!-- Fondo animado con ondas -->
    <div class="background-waves"></div>
    
    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Logo de la empresa -->
      <div class="logo-container">
        <img src="../assets/Ivess.png" alt="Logo Ivess" class="company-logo" />
      </div>
      
      <!-- Título principal -->
      <h1 class="main-title">
        Panel de Operaciones
      </h1>
      
      <p class="subtitle">
        Sistema de gestión de cambios de día y documentación
      </p>
      
      <!-- Indicador visual -->
      <div class="arrow-indicator">⬇️</div>
      
      <!-- Botones de acción -->
      <div class="action-buttons">
        <button @click="abrirVentana" class="btn btn-primary action-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Gestión de Cambios
        </button>
        
        <button @click="irAdjuntos" class="btn btn-secondary action-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Ver Adjuntos
        </button>
      </div>
      
      <!-- Información adicional -->
      <div class="info-text">
        Selecciona una opción para comenzar a trabajar
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="page-footer">
      © 2025 El Jumillano. Desarrollado por Gonzalo Wiñazki. Todos los derechos reservados.
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);
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
}

@keyframes wave-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  position: relative;
  z-index: 2;
  text-align: center;
}

.logo-container {
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease-out;
}

.company-logo {
  width: 180px;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.company-logo:hover {
  transform: scale(1.05);
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 600px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.arrow-indicator {
  font-size: 2rem;
  margin-bottom: 2rem;
  animation: bounce 2s infinite, fadeInUp 0.8s ease-out 0.6s both;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.action-btn {
  min-width: 200px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.info-text {
  color: var(--gray-500);
  font-size: 1rem;
  animation: fadeInUp 0.8s ease-out 1s both;
}

.page-footer {
  background: rgba(30, 64, 175, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  text-align: center;
  padding: 1rem 2rem;
  font-size: 0.875rem;
  position: relative;
  z-index: 3;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    min-width: 250px;
  }
  
  .main-content {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .company-logo {
    width: 150px;
  }
  
  .action-btn {
    min-width: 200px;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>

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