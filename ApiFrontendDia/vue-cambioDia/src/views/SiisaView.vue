<template>
  <div class="siisa-container">
    <!-- Fondo animado con ondas -->
    <div class="background-waves"></div>
    
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Consulta SIISA</h1>
      <p class="subtitle">Consulta la situación financiera de una persona</p>
    </div>

    <!-- Formulario de búsqueda -->
    <div class="search-section">
      <div class="search-card">
        <form @submit.prevent="consultarPersona" class="search-form">
          <div class="form-group">
            <label for="documento" class="label">Número de Documento (DNI)</label>
            <input
              id="documento"
              v-model="formulario.documento"
              type="text"
              class="input"
              placeholder="Ej: 12345678"
              :disabled="cargando"
              @input="limpiarResultados"
            />
          </div>
          
          <div class="form-group">
            <label for="sexo" class="label">Sexo (Opcional)</label>
            <select
              id="sexo"
              v-model="formulario.sexo"
              class="input"
              :disabled="cargando"
            >
              <option value="">Seleccionar...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          
          <button
            type="submit"
            class="btn btn-primary search-btn"
            :disabled="cargando || !formulario.documento.trim()"
          >
            <div v-if="cargando" class="spinner"></div>
            <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {{ cargando ? 'Consultando...' : 'Consultar' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert-error">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {{ error }}
    </div>

    <!-- Resultados -->
    <div v-if="resultado && !error" class="results-section">
      <!-- Semáforo Financiero -->
      <div class="result-card">
        <div class="card-header">
          <h3 class="card-title">Situación Financiera</h3>
        </div>
        
        <div class="semaforo-container">
          <div 
            class="semaforo-light"
            :style="{
              backgroundColor: semaforoEstilos.bgColor,
              borderColor: semaforoEstilos.borderColor,
              color: semaforoEstilos.color
            }"
          >
            <div 
              class="semaforo-circle"
              :style="{ backgroundColor: semaforoEstilos.color }"
            ></div>
            <div class="semaforo-info">
              <div class="semaforo-status">{{ semaforoEstilos.texto }}</div>
              <div class="semaforo-description">{{ resultado.semaforo.situacion }}</div>
            </div>
          </div>
          
          <div class="monto-total">
            <span class="monto-label">Deuda Total:</span>
            <span class="monto-value">{{ formatearMonto(resultado.semaforo.monto_total) }}</span>
          </div>
        </div>
      </div>

      <!-- Información Personal -->
      <div class="result-card">
        <div class="card-header">
          <h3 class="card-title">Información Personal</h3>
        </div>
        <div class="person-info">
          <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span class="info-value">{{ resultado.persona.ApellidoNombre }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">CUIL:</span>
            <span class="info-value">{{ resultado.persona.Cuil }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">DNI:</span>
            <span class="info-value">{{ resultado.persona.NroDoc }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Edad:</span>
            <span class="info-value">{{ resultado.persona.Edad }} años</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha de Nacimiento:</span>
            <span class="info-value">{{ formatearFecha(resultado.persona.Fnac) }}</span>
          </div>
        </div>
      </div>

      <!-- Detalle de Deudas -->
      <div v-if="resultado.semaforo.deudas && resultado.semaforo.deudas.length > 0" class="result-card">
        <div class="card-header">
          <h3 class="card-title">Detalle de Deudas</h3>
        </div>
        
        <div class="deudas-list">
          <div 
            v-for="(deuda, index) in resultado.semaforo.deudas" 
            :key="index" 
            class="deuda-item"
          >
            <div class="deuda-header">
              <span class="deuda-entidad">{{ deuda.entidad }}</span>
              <span class="deuda-monto">{{ formatearMonto(deuda.monto) }}</span>
            </div>
            <div class="deuda-details">
              <span class="deuda-periodo">Período: {{ deuda.periodo }}</span>
              <span class="deuda-origen">{{ deuda.origen }}</span>
              <span v-if="deuda.dias_atraso > 0" class="deuda-atraso">
                {{ deuda.dias_atraso }} días de atraso
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentación Requerida -->
      <div v-if="resultado.semaforo.requiere_documentacion" class="result-card">
        <div class="card-header">
          <h3 class="card-title">Documentación Requerida</h3>
        </div>
        
        <div class="documentacion-list">
          <div 
            v-for="(descripcion, tipo) in resultado.semaforo.documentacion_requerida" 
            :key="tipo"
            class="doc-item"
          >
            <div class="doc-icon">📄</div>
            <div class="doc-content">
              <div class="doc-title">{{ descripcion }}</div>
              <div class="doc-type">{{ formatearTipoDoc(tipo) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SiisaService } from '../services/siisaService.js'

const formulario = ref({
  documento: '',
  sexo: ''
})

const resultado = ref(null)
const error = ref('')
const cargando = ref(false)

const semaforoEstilos = computed(() => {
  if (!resultado.value?.semaforo) return {}
  return SiisaService.procesarSemaforo(resultado.value.semaforo).estilos
})

function limpiarResultados() {
  resultado.value = null
  error.value = ''
}

async function consultarPersona() {
  if (!formulario.value.documento.trim()) return
  
  cargando.value = true
  error.value = ''
  resultado.value = null
  
  try {
    const respuesta = await SiisaService.consultarPersona(
      formulario.value.documento.trim(),
      formulario.value.sexo
    )
    
    if (respuesta.success) {
      resultado.value = respuesta
    } else {
      error.value = 'No se pudieron obtener los datos de la persona'
    }
  } catch (err) {
    error.value = err.message || 'Error al consultar los datos'
  } finally {
    cargando.value = false
  }
}

function formatearMonto(monto) {
  return SiisaService.formatearMonto(monto)
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR')
}

function formatearTipoDoc(tipo) {
  const tipos = {
    datos_personales: 'Datos Personales',
    grupo_familiar: 'Grupo Familiar',
    detalle_mora: 'Detalle de Mora',
    telefonos: 'Contacto',
    datos_laborales: 'Información Laboral',
    sueldo_neto: 'Ingresos'
  }
  return tipos[tipo] || tipo.replace('_', ' ').toUpperCase()
}
</script>

<style scoped>
.siisa-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
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

.header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--gray-600);
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.search-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  border: 1px solid var(--gray-200);
}

.search-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.search-btn {
  padding: 0.75rem 2rem;
  min-width: 140px;
  justify-content: center;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.results-section {
  display: grid;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.result-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--gray-200);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
}

.person-info {
  padding: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--gray-100);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: var(--gray-600);
}

.info-value {
  color: var(--gray-800);
  font-weight: 500;
}

.semaforo-container {
  padding: 2rem;
}

.semaforo-light {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  border: 2px solid;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.semaforo-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 1rem;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.semaforo-info {
  flex: 1;
}

.semaforo-status {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.semaforo-description {
  font-size: 0.95rem;
  opacity: 0.8;
}

.monto-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--gray-50);
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-200);
}

.monto-label {
  font-weight: 600;
  color: var(--gray-600);
}

.monto-value {
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--gray-800);
}

.deudas-list {
  padding: 2rem;
}

.deuda-item {
  background: var(--gray-50);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--gray-200);
}

.deuda-item:last-child {
  margin-bottom: 0;
}

.deuda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.deuda-entidad {
  font-weight: 600;
  color: var(--gray-800);
  flex: 1;
}

.deuda-monto {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--danger-color);
}

.deuda-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray-600);
}

.deuda-atraso {
  color: var(--danger-color);
  font-weight: 600;
}

.documentacion-list {
  padding: 2rem;
}

.doc-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--blue-50);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  border: 1px solid var(--blue-200);
}

.doc-item:last-child {
  margin-bottom: 0;
}

.doc-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.doc-content {
  flex: 1;
}

.doc-title {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
}

.doc-type {
  font-size: 0.875rem;
  color: var(--blue-600);
  font-weight: 500;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .siisa-container {
    padding: 1rem;
  }
  
  .search-form {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .search-card {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .deuda-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .deuda-details {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>