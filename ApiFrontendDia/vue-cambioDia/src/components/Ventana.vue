<template>
  <div class="ventana">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="titulo">Cambio de Día - Cliente</h2>
      <p class="subtitle">Consulte y modifique las fechas de visita disponibles</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="input-group">
        <label for="numeroCliente" class="input-label">Número de Cliente</label>
        <div class="input-with-button">
          <input 
            id="numeroCliente"
            v-model="numeroCliente" 
            type="text" 
            placeholder="Ingrese el número de cliente" 
            class="input"
            @keyup.enter="consultarPropuestas"
          />
          <button @click="consultarPropuestas" class="btn btn-primary" :disabled="cargando || !numeroCliente">
            <svg v-if="cargando" class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar fechas
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="cargando && !propuestas.length" class="loading-state">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <span class="loading-text">Consultando propuestas disponibles...</span>
    </div>

    <!-- Results Section -->
    <div v-if="propuestas.length" class="results-section">
      <div class="results-header">
        <h3 class="results-title">Fechas Disponibles</h3>
        <span class="results-count">{{ propuestas.length }} opciones</span>
      </div>

      <div class="fechas-list">
        <label 
          v-for="(propuesta, index) in propuestas" 
          :key="propuesta.nroPropuesta" 
          class="fecha-item"
          :class="{ 'selected': seleccionada?.nroPropuesta === propuesta.nroPropuesta }"
        >
          <input
            type="radio"
            :value="propuesta"
            v-model="seleccionada"
            class="radio-input"
          />
          <div class="fecha-content">
            <div class="fecha-header">
              <div class="route-info">
                <span class="route-label">Reparto:</span>
                <span class="route-value">{{ propuesta.ruta }}</span>
              </div>
              <div class="day-badge">{{ diaNombre(propuesta.diaReparto) }}</div>
            </div>
            <div class="fecha-details">
              <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Horario:</strong> {{ propuesta.horarioVisita }}</span>
              </div>
              <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span><strong>Dirección cercana:</strong> {{ propuesta.direccion }}</span>
              </div>
            </div>
          </div>
          <div class="radio-indicator">
            <div class="radio-dot"></div>
          </div>
        </label>
      </div>

      <div class="action-section">
        <button 
          @click="confirmarSeleccion" 
          class="btn btn-success" 
          :disabled="cargando || !seleccionada"
        >
          <svg v-if="cargando" class="spinner-sm" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <svg v-else class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Confirmar Selección
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!propuestas.length && numeroCliente && !cargando" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="empty-title">No hay propuestas disponibles</h3>
      <p class="empty-description">No se encontraron fechas disponibles para este cliente.</p>
    </div>

    <!-- Messages -->
    <div v-if="mensaje" class="mensaje" :class="{ 'success': mensaje.includes('correctamente'), 'error': !mensaje.includes('correctamente') }">
      <svg class="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="mensaje.includes('correctamente')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ mensaje }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const numeroCliente = ref('')
const propuestas = ref<any[]>([])
const seleccionada = ref<any | null>(null)
const mensaje = ref('')
const cargando = ref(false)

// Función para traducir letra a nombre de día
function diaNombre(letra: string) {
  const dias: Record<string, string> = {
    A: 'Lunes',
    B: 'Martes',
    C: 'Miércoles',
    D: 'Jueves',
    E: 'Viernes',
    F: 'Sábado'
  }
  return dias[letra] || letra
}

const consultarPropuestas = async () => {
  if (!numeroCliente.value) {
    mensaje.value = 'Por favor ingresa un número de cliente.'
    return
  }
  cargando.value = true
  try {
    const res = await axios.get(`http://192.168.0.250:3002/api/propuestas/${numeroCliente.value}`)
    propuestas.value = res.data
    seleccionada.value = null
    mensaje.value = ''
  } catch (err) {
    console.error(err)
    mensaje.value = 'No se pudieron obtener las propuestas.'
  } finally {
    cargando.value = false
  }
}

const confirmarSeleccion = async () => {
  if (!seleccionada.value) {
    mensaje.value = 'Selecciona una propuesta antes de confirmar.'
    return
  }
  cargando.value = true
  try {
    const payload = {
      nroCta: Number(numeroCliente.value),
      cdRuta: seleccionada.value.ruta + seleccionada.value.diaReparto,
      orden: seleccionada.value.ordenRuta,
    }
    await axios.post('http://192.168.0.250:3002/api/cambiar-visita', payload)
    mensaje.value = 'Selección enviada correctamente.'
    numeroCliente.value = ''
    propuestas.value = []
    seleccionada.value = null
  } catch (err) {
    console.error(err)
    mensaje.value = 'Error al confirmar la selección.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.ventana {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-200);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--gray-100);
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: var(--blue-100);
  color: var(--blue-600);
  border-radius: 50%;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--blue-800);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--gray-600);
  margin: 0;
  font-size: 1rem;
}

.search-section {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.input-with-button {
  display: flex;
  gap: 0.75rem;
}

.input {
  flex: 1;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  color: var(--gray-600);
}

.loading-text {
  font-weight: 500;
}

.results-section {
  margin-bottom: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--gray-200);
}

.results-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--blue-800);
  margin: 0;
}

.results-count {
  background: var(--blue-100);
  color: var(--blue-700);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.fechas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.fecha-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.fecha-item:hover {
  border-color: var(--green-300);
  background: var(--green-50);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.fecha-item.selected {
  border: 3px solid #10b981;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.fecha-content {
  flex: 1;
  min-width: 0;
}

.fecha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.route-label {
  font-weight: 600;
  color: var(--gray-700);
}

.route-value {
  font-weight: 700;
  color: var(--blue-700);
  background: var(--blue-100);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.day-badge {
  background: var(--green-100);
  color: var(--green-700);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.fecha-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-700);
}

.detail-icon {
  width: 1rem;
  height: 1rem;
  color: var(--blue-500);
  flex-shrink: 0;
}

.radio-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--gray-300);
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.fecha-item.selected .radio-indicator {
  border-color: #10b981;
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.radio-dot {
  width: 0.75rem;
  height: 0.75rem;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.fecha-item.selected .radio-dot {
  opacity: 1;
  transform: scale(1);
}

.action-section {
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 2px solid var(--gray-100);
}

.btn-success {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
  color: white !important;
  border: none !important;
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #047857 0%, #059669 100%) !important;
}

.btn-success:active:not(:disabled) {
  transform: translateY(0);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: var(--gray-400);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-700);
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 1rem;
  margin: 0;
}

.mensaje {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: var(--border-radius-lg);
  font-weight: 500;
  margin-top: 1.5rem;
}

.mensaje.success {
  background: var(--green-50);
  color: var(--green-700);
  border: 1px solid var(--green-200);
}

.mensaje.error {
  background: var(--red-50);
  color: var(--red-700);
  border: 1px solid var(--red-200);
}

.message-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
}

.spinner-sm {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .ventana {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .input-with-button {
    flex-direction: column;
  }
  
  .fecha-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .fecha-details {
    gap: 0.5rem;
  }
  
  .detail-item {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .ventana {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .titulo {
    font-size: 1.5rem;
  }
  
  .header-icon {
    width: 3rem;
    height: 3rem;
  }
  
  .fecha-item {
    padding: 1rem;
  }
}
</style>