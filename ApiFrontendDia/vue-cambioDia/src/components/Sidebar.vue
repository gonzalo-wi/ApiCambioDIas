<template>
  <div class="sidebar-container">
    <!-- Logo y título -->
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <img src="../assets/Ivess.png" alt="Logo Ivess" class="sidebar-logo" />
      </div>
      <h2 class="sidebar-title">Panel de Operaciones</h2>
      <p class="sidebar-subtitle">Call Center</p>
    </div>

    <!-- Menú de navegación -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/panel/dashboard" class="nav-link" :class="{ active: $route.path === '/panel/dashboard' }">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M80-80v-481l280-119v80l200-80v120h320v480H80Zm80-80h640v-320H480v-82l-200 80v-78l-120 53v347Zm280-80h80v-160h-80v160Zm-160 0h80v-160h-80v160Zm320 0h80v-160h-80v160Zm280-320H680l40-320h120l40 320ZM160-160h640-640Z"/>
              </svg>
            </div>
            <span class="nav-text">Dashboard</span>
          </router-link>
        </li>

        <li class="nav-item">
          <button @click="abrirVentana" class="nav-link nav-button">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M200-640h560v-80H200v80Zm0 0v-80 80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v227q-19-9-39-15t-41-9v-43H200v400h252q7 22 16.5 42T491-80H200Zm520 40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm67-105 28-28-75-75v-112h-40v128l87 87Z"/>
              </svg>
            </div>
            <span class="nav-text">Cambio de Día</span>
          </button>
        </li>

        <li class="nav-item">
          <router-link to="/panel/adjuntos" class="nav-link" :class="{ active: $route.path === '/panel/adjuntos' }">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M160-160q-33 0-56.5-23.5T80-240v-400q0-33 23.5-56.5T160-720h240l80-80h320q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm73-280h207v-207L233-440Zm-73-40 160-160H160v160Zm0 120v120h640v-480H520v280q0 33-23.5 56.5T440-360H160Zm280-160Z"/>
              </svg>
            </div>
            <span class="nav-text">Adjuntos S1</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/panel/siisa" class="nav-link" :class="{ active: $route.path === '/panel/siisa' }">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm179-80h442L480-830 259-720ZM80-120v-80h482q2 21 5 40.5t9 39.5H80Zm600-310v-130h80v90l-80 40ZM800 0q-69-17-114.5-79.5T640-218v-102l160-80 160 80v102q0 76-45.5 138.5T800 0Zm-29-120 139-138-42-42-97 95-39-39-42 43 81 81ZM259-720h442-442Z"/>
              </svg>
            </div>
            <span class="nav-text">Consulta SIISA</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/panel/whatsapp" class="nav-link" :class="{ active: $route.path === '/panel/whatsapp' }">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <span class="nav-text">WhatsApp</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/panel/jaula" class="nav-link" :class="{ active: $route.path === '/panel/jaula' }">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 80q17 0 28.5-11.5T760-320q0-17-11.5-28.5T720-360q-17 0-28.5 11.5T680-320q0 17 11.5 28.5T720-280Zm-40-200h170l-90-120h-80v120ZM360-540Z"/>
              </svg>
            </div>
            <span class="nav-text">Disponibilidad Jaula</span>
          </router-link>
        </li>

        <li class="nav-item nav-item-group">
          <button 
            @click="toggleGestionFC" 
            class="nav-link nav-button"
            :class="{ active: $route.path.startsWith('/panel/gestion-fc') }"
          >
            <div class="nav-icon-wrapper">
              <span class="material-symbols-outlined">
                water_drop
              </span>
            </div>
            <span class="nav-text">Gestión F/C</span>
            <svg 
              class="nav-chevron" 
              :class="{ rotated: gestionFCOpen }" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          <transition name="submenu">
            <ul v-show="gestionFCOpen" class="nav-submenu">
              <li>
                <router-link 
                  to="/panel/gestion-fc/instalacion" 
                  class="nav-link nav-sublink"
                  :class="{ active: $route.path === '/panel/gestion-fc/instalacion' }"
                >
                  <span class="nav-text">Instalación</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/panel/gestion-fc/consultar-token" 
                  class="nav-link nav-sublink"
                  :class="{ active: $route.path === '/panel/gestion-fc/consultar-token' }"
                >
                  <span class="nav-text">Consultar Token</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/panel/entregas" 
                  class="nav-link nav-sublink"
                  :class="{ active: $route.path === '/panel/entregas' }"
                >
                  <span class="nav-text">Entregas</span>
                </router-link>
              </li>
            </ul>
          </transition>
        </li>


        <li class="nav-item">
          <router-link to="/panel/mora-clientes" class="nav-link" :class="{ active: $route.path === '/panel/mora-clientes' }">
            <div class="nav-icon-wrapper">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-36.5-60T536-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 55T500-300q-35 0-60.5-21T410-376l-66 26q14 48 43.5 77.5T444-238v38Zm36 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-40Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
              </svg>
            </div>
            <span class="nav-text">Mora de Clientes</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar -->
    <div class="sidebar-footer">
      <div class="footer-info">
        <p class="footer-text">© 2025 El Jumillano</p>
        <p class="footer-dev"><strong>G.Wiñazki & L.Peralta</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const gestionFCOpen = ref(route.path.startsWith('/panel/gestion-fc'))

function abrirVentana() {
  window.open('/ventanaView', 'ventanaCallCenter', 'width=420,height=600,menubar=no,toolbar=no,location=no,status=no')
}

function toggleGestionFC() {
  gestionFCOpen.value = !gestionFCOpen.value
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  text-align: center;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
}

.logo-wrapper {
  display: inline-block;
  padding: 0.75rem;
  background: white;
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.sidebar-logo {
  width: 70px;
  height: auto;
  display: block;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.sidebar-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0 0.75rem;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: #3b82f6;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-link:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%);
  color: #1e40af;
  transform: translateX(4px);
}

.nav-link:hover::before {
  transform: scaleY(1);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%);
  color: #1e40af;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.nav-link.active::before {
  transform: scaleY(1);
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 0.75rem;
  flex-shrink: 0;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-link:hover .nav-icon-wrapper,
.nav-link.active .nav-icon-wrapper {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 0.95rem;
}

/* Submenu styles */
.nav-item-group {
  flex-direction: column;
}

.nav-chevron {
  width: 20px;
  height: 20px;
  margin-left: auto;
  transition: transform 0.3s ease;
}

.nav-chevron.rotated {
  transform: rotate(180deg);
}

.nav-submenu {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0 0.25rem 2.75rem;
  overflow: hidden;
}

.nav-sublink {
  padding: 0.6rem 1rem !important;
  font-size: 0.88rem !important;
  border-radius: 8px !important;
}

.nav-sublink::before {
  content: '•';
  margin-right: 0.5rem;
  color: #94a3b8;
}

.nav-sublink.active::before {
  color: #1e40af;
}

/* Submenu transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.footer-info {
  text-align: center;
}

.footer-text {
  margin: 0 0 0.25rem;
  font-size: 0.8rem;
  color: #64748b;
}

.footer-dev {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

.footer-dev strong {
  color: #475569;
  font-weight: 600;
}

/* Scrollbar personalizado */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 640px) {
  .sidebar-container {
    height: auto;
  }
  
  .sidebar-header {
    padding: 1.5rem 1rem;
  }
  
  .logo-wrapper {
    padding: 0.5rem;
  }
  
  .sidebar-logo {
    width: 50px;
  }
  
  .sidebar-title {
    font-size: 1.1rem;
  }
  
  .sidebar-subtitle {
    font-size: 0.75rem;
  }
  
  .sidebar-nav {
    padding: 1rem 0;
  }
  
  .nav-link {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
  }
  
  .nav-icon-wrapper {
    width: 32px;
    height: 32px;
  }
  
  .nav-icon {
    width: 18px;
    height: 18px;
  }
}
</style>