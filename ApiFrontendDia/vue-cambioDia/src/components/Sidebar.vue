<template>
  <div class="sidebar-container">
    <!-- Logo y título -->
    <div class="sidebar-header">
      <img src="../assets/Ivess.png" alt="Logo Ivess" class="sidebar-logo" />
      <h2 class="sidebar-title">Panel de Operaciones</h2>
    </div>

    <!-- Menú de navegación -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z"></path>
            </svg>
            Dashboard
          </router-link>
        </li>

        <li class="nav-item">
          <button @click="abrirVentana" class="nav-link nav-button">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Cambios de dias
          </button>
        </li>

        <li class="nav-item">
          <router-link to="/adjuntos" class="nav-link" :class="{ active: $route.path === '/adjuntos' }">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Ver Adjuntos S1
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/siisa" class="nav-link" :class="{ active: $route.path === '/siisa' }">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Consulta SIISA
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar -->
    <div class="sidebar-footer">
      <p class="footer-text">© 2025 El Jumillano</p>
      <p class="footer-dev">Desarrollado por Gonzalo Wiñazki</p>
    </div>
  </div>
</template>

<script setup>
function abrirVentana() {
  window.open('/ventanaView', 'ventanaCallCenter', 'width=420,height=600,menubar=no,toolbar=no,location=no,status=no')
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(30, 64, 175, 0.1);
}

.sidebar-logo {
  width: 80px;
  height: auto;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
  line-height: 1.3;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 0;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-button {
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
  border-right: 3px solid #3b82f6;
}

.nav-link.active {
  background: rgba(59, 130, 246, 0.15);
  color: #1e40af;
  border-right: 3px solid #3b82f6;
  font-weight: 600;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(30, 64, 175, 0.1);
  background: rgba(30, 64, 175, 0.05);
}

.footer-text {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.footer-dev {
  margin: 0;
  font-size: 0.7rem;
  color: #9ca3af;
  text-align: center;
}

/* Responsive */
@media (max-width: 640px) {
  .sidebar-container {
    height: auto;
  }
  
  .sidebar-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    text-align: left;
  }
  
  .sidebar-logo {
    width: 50px;
    margin-right: 1rem;
    margin-bottom: 0;
  }
  
  .sidebar-title {
    font-size: 1rem;
  }
  
  .sidebar-nav {
    padding: 1rem 0;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .nav-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}
</style>