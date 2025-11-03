<template>
  <div class="jaula-container">
    <!-- Fondo con olas animadas -->
    <div class="background-waves"></div>

    <!-- Header -->
    <div class="jaula-header">
      <div class="header-icon-wrapper">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 80q17 0 28.5-11.5T760-320q0-17-11.5-28.5T720-360q-17 0-28.5 11.5T680-320q0 17 11.5 28.5T720-280Zm-40-200h170l-90-120h-80v120ZM360-540Z"/>
          </svg>
        </div>
      </div>
      <div class="header-content">
        <h1>Disponibilidad en Jaula</h1>
        <p>Consulta el espacio disponible en los camiones para dispensers</p>
      </div>
    </div>

    <!-- Formulario de Consulta -->
    <div class="content-card">
      <div class="card-header">
        <div class="header-icon-small">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h3 class="card-title">Consultar Disponibilidad</h3>
          <p class="card-subtitle">Ingresa el ID del reparto para ver las fechas disponibles</p>
        </div>
      </div>

      <div class="card-body">
        <div class="form-group">
          <label class="form-label">
            <svg class="label-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            ID Reparto
          </label>
          <input 
            v-model="idReparto" 
            type="text" 
            placeholder="Ej: 270" 
            class="form-input"
            @keyup.enter="consultar"
          />
        </div>

        <div class="button-group">
          <button @click="consultar" class="btn-primary" :disabled="loading || !idReparto">
            <svg v-if="loading" class="btn-spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {{ loading ? 'Consultando...' : 'Consultar' }}
          </button>
          <button @click="limpiar" class="btn-secondary">
            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div v-if="error" class="alert-error">
      <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="alert-content">
        <h4>Error al consultar</h4>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-if="disponibilidad.length > 0" class="results-section">
      <div class="results-header">
        <h3 class="results-title">
          <svg class="title-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Fechas Disponibles
        </h3>
        <div class="results-count">{{ disponibilidad.length }} fechas encontradas</div>
      </div>

      <div class="disponibilidad-grid">
        <div 
          v-for="(item, index) in disponibilidad" 
          :key="index"
          class="disponibilidad-card"
          :class="{ 'poca-disponibilidad': (4 - item.cantidad) <= 1 }"
        >
          <div class="card-date">
            <svg class="date-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div class="date-day">{{ formatearFecha(item.fecha) }}</div>
              <div class="date-full">{{ formatearFechaCompleta(item.fecha) }}</div>
            </div>
          </div>
          
          <div class="card-separator"></div>
          
          <div class="card-cantidad">
            <div class="cantidad-label">Lugares disponibles</div>
            <div class="cantidad-value">
              <svg class="cantidad-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z"/>
              </svg>
              {{ 4 - item.cantidad }} / 4
            </div>
            <div class="ocupados-info">{{ item.cantidad }} dispenser{{ item.cantidad !== 1 ? 's' : '' }} asignado{{ item.cantidad !== 1 ? 's' : '' }}</div>
          </div>

          <div v-if="(4 - item.cantidad) <= 1" class="warning-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Poca disponibilidad
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="consultaRealizada && !loading" class="empty-state">
      <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3>No hay disponibilidad</h3>
      <p>No se encontraron fechas disponibles para este reparto</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { consultarDisponibilidadJaula } from '@/services/jaulaService'

const idReparto = ref('')
const disponibilidad = ref([])
const loading = ref(false)
const error = ref(null)
const consultaRealizada = ref(false)

async function consultar() {
  if (!idReparto.value) return
  
  loading.value = true
  error.value = null
  consultaRealizada.value = false
  
  try {
    const response = await consultarDisponibilidadJaula(idReparto.value)
    if (response.success) {
      disponibilidad.value = response.data
      consultaRealizada.value = true
    } else {
      error.value = 'No se pudo obtener la disponibilidad'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al consultar la disponibilidad'
  } finally {
    loading.value = false
  }
}

function limpiar() {
  idReparto.value = ''
  disponibilidad.value = []
  error.value = null
  consultaRealizada.value = false
}

function formatearFecha(fecha) {
  const date = new Date(fecha + 'T00:00:00')
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return `${dias[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`
}

function formatearFechaCompleta(fecha) {
  const date = new Date(fecha + 'T00:00:00')
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`
}
</script>

<style scoped>
.jaula-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem;
  position: relative;
  min-height: 100vh;
}

/* Fondo con olas animadas */
.background-waves {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-waves::before,
.background-waves::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  z-index: -1;
}

.background-waves::before {
  background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.04) 0%, transparent 50%);
  animation: wave 20s ease-in-out infinite;
}

.background-waves::after {
  background: radial-gradient(circle at 60% 70%, rgba(59, 130, 246, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(37, 99, 235, 0.03) 0%, transparent 50%);
  animation: wave 25s ease-in-out infinite reverse;
}

@keyframes wave {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -50px) rotate(5deg); }
  66% { transform: translate(-20px, 20px) rotate(-5deg); }
}

.jaula-container > * {
  position: relative;
  z-index: 1;
}

/* Header */
.jaula-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.jaula-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, -20px); }
}

.header-icon-wrapper {
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  padding: 1.25rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.header-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.header-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.header-content h1 {
  margin: 0 0 0.75rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content p {
  margin: 0;
  font-size: 1.05rem;
  opacity: 0.95;
  font-weight: 300;
  line-height: 1.5;
}

/* Content Card */
.content-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.card-header {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 1.75rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header-icon-small {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  padding: 0.75rem;
}

.header-icon-small svg {
  width: 100%;
  height: 100%;
}

.card-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f2937;
}

.card-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.card-body {
  padding: 2rem;
}

/* Form */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alerts */
.alert-error {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #dc2626;
}

.alert-content h4 {
  margin: 0 0 0.25rem 0;
  color: #991b1b;
  font-size: 1rem;
  font-weight: 700;
}

.alert-content p {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
}

/* Results */
.results-section {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.results-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: #3b82f6;
}

.results-count {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.disponibilidad-grid {
  display: grid;
  gap: 1.25rem;
}

.disponibilidad-card {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.disponibilidad-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.disponibilidad-card.poca-disponibilidad {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
}

.card-date {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date-icon {
  width: 40px;
  height: 40px;
  color: #3b82f6;
  flex-shrink: 0;
}

.date-day {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.date-full {
  font-size: 0.85rem;
  color: #6b7280;
}

.card-separator {
  width: 2px;
  height: 50px;
  background: linear-gradient(to bottom, transparent, #e5e7eb, transparent);
}

.card-cantidad {
  text-align: right;
}

.cantidad-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.cantidad-value {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
}

.cantidad-icon {
  width: 36px;
  height: 36px;
  color: #3b82f6;
}

.ocupados-info {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
  font-style: italic;
}

.warning-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.warning-badge svg {
  width: 14px;
  height: 14px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 16px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin: 0 auto 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .jaula-container {
    padding: 1.5rem;
  }

  .jaula-header {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .disponibilidad-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .card-separator {
    width: 100%;
    height: 2px;
  }

  .card-cantidad {
    text-align: center;
  }

  .cantidad-value {
    justify-content: center;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
