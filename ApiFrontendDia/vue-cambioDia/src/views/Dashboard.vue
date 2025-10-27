<template>
  <div class="dashboard-container">
    <!-- Fondo animado con ondas -->
    <div class="background-waves"></div>
    
    <!-- Contenido principal -->
    <div class="dashboard-content">
      <!-- Bienvenida mejorada -->
      <div class="welcome-section">
        <div class="logo-badge">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        
        <h1 class="welcome-title">
          Panel de Operaciones
        </h1>
        
        <p class="welcome-subtitle">
          Sistema integral de gestión empresarial
        </p>
      </div>

      <!-- Indicador visual -->
      <div class="arrow-indicator">⬇️</div>
      
      <!-- Cards de acceso rápido -->
      <div class="quick-access-cards">
        <div class="access-card featured" @click="abrirVentana">
          <div class="card-badge">Popular</div>
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M200-640h560v-80H200v80Zm0 0v-80 80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v227q-19-9-39-15t-41-9v-43H200v400h252q7 22 16.5 42T491-80H200Zm520 40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm67-105 28-28-75-75v-112h-40v128l87 87Z"/>
            </svg>
          </div>
          <h3 class="card-title">Cambio de Día</h3>
          <p class="card-description">
            Gestiona y modifica las fechas de visita de clientes
          </p>
          <div class="card-arrow">→</div>
        </div>

        <div class="access-card" @click="irToken">
          <div class="card-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
          <h3 class="card-title">Generar Token</h3>
          <p class="card-description">
            Genera tokens de acceso para dispensers
          </p>
          <div class="card-arrow">→</div>
        </div>

        <div class="access-card" @click="irAdjuntos">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M160-160q-33 0-56.5-23.5T80-240v-400q0-33 23.5-56.5T160-720h240l80-80h320q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm73-280h207v-207L233-440Zm-73-40 160-160H160v160Zm0 120v120h640v-480H520v280q0 33-23.5 56.5T440-360H160Zm280-160Z"/>
            </svg>
          </div>
          <h3 class="card-title">Adjuntos S1</h3>
          <p class="card-description">
            Consulta y gestiona documentos adjuntos
          </p>
          <div class="card-arrow">→</div>
        </div>

        <div class="access-card" @click="irSiisa">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm179-80h442L480-830 259-720ZM80-120v-80h482q2 21 5 40.5t9 39.5H80Zm600-310v-130h80v90l-80 40ZM800 0q-69-17-114.5-79.5T640-218v-102l160-80 160 80v102q0 76-45.5 138.5T800 0Zm-29-120 139-138-42-42-97 95-39-39-42 43 81 81ZM259-720h442-442Z"/>
            </svg>
          </div>
          <h3 class="card-title">Consulta SIISA</h3>
          <p class="card-description">
            Verifica la situación financiera de personas
          </p>
          <div class="card-arrow">→</div>
        </div>

        <div class="access-card whatsapp-card" @click="irWhatsApp">
          <div class="card-badge coming-soon">Próximamente</div>
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <h3 class="card-title">Mensajería WhatsApp</h3>
          <p class="card-description">
            Envía mensajes individuales y masivos a clientes
          </p>
          <div class="card-arrow">→</div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="info-section">
        <div class="info-card">
          <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="info-text">
            Utiliza el menú lateral o los accesos rápidos para navegar por el sistema
          </p>
        </div>
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
  router.push('/panel/adjuntos')
}

function irSiisa() {
  router.push('/panel/siisa')
}

function irToken() {
  router.push('/panel/token')
}

function irWhatsApp() {
  router.push('/panel/whatsapp')
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
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
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

.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.logo-badge svg {
  width: 36px;
  height: 36px;
  color: white;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  letter-spacing: -1px;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  font-weight: 500;
}

.arrow-indicator {
  font-size: 2rem;
  margin-bottom: 2rem;
  animation: bounce 2s infinite, fadeInUp 0.8s ease-out 0.6s both;
  filter: grayscale(0.3);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.quick-access-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  max-width: 1100px;
  width: 100%;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.access-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.access-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.access-card:hover::before {
  opacity: 1;
}

.access-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

.access-card.featured {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-color: #1e40af;
  color: white;
}

.access-card.featured .card-title,
.access-card.featured .card-description {
  color: white;
}

.access-card.featured .card-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.access-card.whatsapp-card {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.35);
}

.access-card.whatsapp-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(5, 150, 105, 0.4);
}

.access-card.whatsapp-card .card-title,
.access-card.whatsapp-card .card-description {
  color: white;
}

.access-card.whatsapp-card .card-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.access-card.whatsapp-card .card-arrow {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-badge.coming-soon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
  font-weight: 700;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  color: #1e40af;
  transition: all 0.3s ease;
}

.access-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.card-arrow {
  font-size: 1.5rem;
  color: #3b82f6;
  font-weight: bold;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.access-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.access-card.featured .card-arrow {
  color: white;
}

.info-section {
  animation: fadeInUp 0.8s ease-out 1s both;
}

.info-card {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
}

.info-text {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
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
    font-size: 2.25rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .quick-access-cards {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .dashboard-content {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.875rem;
  }
  
  .logo-badge {
    width: 60px;
    height: 60px;
  }
  
  .logo-badge svg {
    width: 30px;
    height: 30px;
  }
  
  .access-card {
    padding: 1.75rem 1.25rem;
  }
  
  .card-icon {
    width: 50px;
    height: 50px;
  }
  
  .card-icon svg {
    width: 24px;
    height: 24px;
  }
}
</style>