<template>
  <div class="dashboard-container">
    <!-- Fondo animado con ondas -->
    <div class="background-waves"></div>
    
    <!-- Contenido principal -->
    <div class="dashboard-content">
      <!-- Bienvenida -->
      <div class="welcome-section">
        <h1 class="welcome-title">
          Bienvenido al Panel de Operaciones
        </h1>
        
        <p class="welcome-subtitle">
          Sistema de gestión de cambios de día y documentación
        </p>
      </div>

      <!-- Indicador visual -->
      <div class="arrow-indicator">⬇️</div>
      
      <!-- Cards de acceso rápido -->
      <div class="quick-access-cards">
        <div class="access-card" @click="abrirVentana">
          <div class="card-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <h3 class="card-title">Gestión de Cambios</h3>
          <p class="card-description">
            Accede al sistema de gestión de cambios de día
          </p>
        </div>

        <div class="access-card" @click="irAdjuntos">
          <div class="card-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="card-title">Ver Adjuntos</h3>
          <p class="card-description">
            Consulta y gestiona los documentos adjuntos
          </p>
        </div>

        <div class="access-card" @click="irSiisa">
          <div class="card-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h3 class="card-title">Consulta SIISA</h3>
          <p class="card-description">
            Consulta la situación financiera de una persona
          </p>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="info-section">
        <p class="info-text">
          Selecciona una opción del menú lateral o utiliza los accesos rápidos para comenzar
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function abrirVentana() {
  window.open('/ventanaView', 'ventanaCallCenter', 'width=420,height=600,menubar=no,toolbar=no,location=no,status=no')
}

function irAdjuntos() {
  router.push('/adjuntos')
}

function irSiisa() {
  router.push('/siisa')
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 0;
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

.dashboard-content {
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

.welcome-section {
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease-out;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--gray-600);
  margin-bottom: 0;
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

.quick-access-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  width: 100%;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.access-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(30, 64, 175, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.access-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.card-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
}

.card-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.info-section {
  animation: fadeInUp 0.8s ease-out 1s both;
}

.info-text {
  color: #9ca3af;
  font-size: 0.95rem;
  margin: 0;
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
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .quick-access-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .dashboard-content {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .access-card {
    padding: 1.5rem;
  }
  
  .card-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .card-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>