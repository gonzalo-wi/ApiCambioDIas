<template>
  <!-- Pantalla de carga al ingresar -->
  <transition name="fade">
    <div v-if="loading" class="loading-screen">
      <div class="loader-container">
        <div class="loader-logo">
          <img src="../assets/Ivess.png" alt="Logo" class="pulse-logo" />
        </div>
        <div class="loader-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Ingresando al Sistema...</p>
      </div>
    </div>
  </transition>

  <!-- Vista principal -->
  <div v-if="!loading" class="welcome-page">
    <!-- Partículas de fondo animadas -->
    <div class="particles">
      <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle(n)"></div>
    </div>

    <div class="welcome-card">
      <!-- Logo con efecto de brillo -->
      <div class="logo-container">
        <div class="logo-glow"></div>
        <img src="../assets/Ivess.png" alt="Ivess Logo" class="logo-img" />
      </div>
      
      <!-- Título con animación de texto -->
      <h1 class="main-title">
        <span class="title-word" style="animation-delay: 0.1s">Bienvenido</span>
        <span class="title-word" style="animation-delay: 0.2s">al</span>
        <span class="title-word" style="animation-delay: 0.3s">Dashboard</span>
      </h1>
      <h2 class="main-title-second">
        <span class="title-word" style="animation-delay: 0.4s">de</span>
        <span class="title-word" style="animation-delay: 0.5s">Operaciones</span>
      </h2>
      
      <div class="badge-container">
        <div class="badge">
          <svg class="badge-icon" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
          </svg>
          <span>Call Center</span>
        </div>
      </div>
      
      <div class="divider-wrapper">
        <div class="divider"></div>
        <div class="divider-dot"></div>
        <div class="divider"></div>
      </div>
      
      <p class="description">
        <svg class="desc-icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
        Sistema de gestión y administración integral
      </p>
      
      <button @click="ingresarSistema" class="btn-ingresar">
        <span class="btn-bg"></span>
        <svg class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
        </svg>
        <span class="btn-text">Ingresar al Sistema</span>
        <svg class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
        </svg>
      </button>
    </div>

    <!-- Footer -->
    <div class="welcome-footer">
      <p>© 2025 El Jumillano • Desarrollado por <strong>Gonzalo Wiñazki</strong></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeView',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    ingresarSistema() {
      this.loading = true
      // Simular carga de 1.5 segundos antes de redirigir
      setTimeout(() => {
        this.$router.push('/panel/dashboard')
      }, 1500)
    },
    getParticleStyle(n) {
      const randomX = Math.random() * 100
      const randomY = Math.random() * 100
      const randomDelay = Math.random() * 5
      const randomDuration = 10 + Math.random() * 20
      const randomSize = 2 + Math.random() * 4
      
      return {
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`
      }
    }
  }
}
</script>

<style scoped>
/* Pantalla de carga */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-container {
  text-align: center;
}

.loader-logo {
  margin-bottom: 2rem;
}

.pulse-logo {
  width: 120px;
  height: auto;
  animation: pulse-scale 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
}

@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.loader-spinner {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(2) {
  width: 75%;
  height: 75%;
  top: 12.5%;
  left: 12.5%;
  animation-delay: -0.3s;
  border-top-color: rgba(255, 255, 255, 0.7);
}

.spinner-ring:nth-child(3) {
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  animation-delay: -0.6s;
  border-top-color: rgba(255, 255, 255, 0.4);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 1px;
  animation: pulse-opacity 1.5s ease-in-out infinite;
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Transiciones */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Vista principal mejorada */
.welcome-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-image: url('../assets/fondoAgua.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.welcome-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.03) 0%, rgba(59, 130, 246, 0.08) 100%);
  z-index: 1;
}

/* Partículas flotantes */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

.welcome-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 4rem 3.5rem;
  max-width: 650px;
  width: 100%;
  text-align: center;
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  animation: cardEntry 1s ease-out;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.logo-container {
  position: relative;
  margin-bottom: 2.5rem;
  display: inline-block;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  animation: glow-pulse 3s ease-in-out infinite;
  border-radius: 50%;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.logo-img {
  position: relative;
  width: 220px;
  height: auto;
  filter: drop-shadow(0 15px 40px rgba(30, 64, 175, 0.25));
  animation: float-logo 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes float-logo {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.main-title,
.main-title-second {
  font-weight: 800;
  color: #1e40af;
  margin: 0;
  letter-spacing: -1.5px;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(30, 64, 175, 0.2);
}

.main-title {
  font-size: 3rem;
  margin-bottom: 0.25rem;
}

.main-title-second {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.title-word {
  display: inline-block;
  margin: 0 0.3rem;
  animation: wordSlideIn 0.6s ease-out both;
}

@keyframes wordSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.badge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  animation: badgeBounce 1s ease-out 0.5s both;
}

@keyframes badgeBounce {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.badge-icon {
  width: 24px;
  height: 24px;
}

.divider-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.divider {
  height: 3px;
  width: 80px;
  background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
  border-radius: 2px;
  animation: dividerExpand 1s ease-out 0.8s both;
}

@keyframes dividerExpand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 80px;
    opacity: 1;
  }
}

.divider-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
}

.description {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.15rem;
  color: #64748b;
  margin: 0 0 2.5rem 0;
  font-weight: 500;
  line-height: 1.6;
}

.desc-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.btn-ingresar {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.35rem 3.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  letter-spacing: 0.5px;
  margin-bottom: 2.5rem;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.btn-ingresar:hover .btn-bg {
  left: 100%;
}

.btn-ingresar:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 15px 50px rgba(59, 130, 246, 0.5);
}

.btn-ingresar:active {
  transform: translateY(-3px) scale(1.01);
}

.btn-icon {
  width: 28px;
  height: 28px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-ingresar:hover .btn-icon:first-child {
  transform: translateX(-8px);
}

.btn-ingresar:hover .btn-icon:last-child {
  transform: translateX(8px);
}

.welcome-footer {
  position: relative;
  z-index: 2;
  margin-top: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.welcome-footer strong {
  color: #3b82f6;
  font-weight: 700;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 3rem 2rem;
  }

  .main-title {
    font-size: 2.25rem;
  }

  .main-title-second {
    font-size: 1.75rem;
  }

  .logo-img {
    width: 160px;
  }

  .btn-ingresar {
    padding: 1.15rem 2.5rem;
    font-size: 1.1rem;
  }

  .title-word {
    margin: 0 0.15rem;
  }
}

@media (max-width: 480px) {
  .welcome-page {
    padding: 1rem;
  }

  .main-title {
    font-size: 1.85rem;
  }

  .main-title-second {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }

  .badge {
    font-size: 0.95rem;
    padding: 0.6rem 1.2rem;
  }
}
</style>
