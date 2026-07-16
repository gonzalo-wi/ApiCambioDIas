<template>
  <div class="siisa-container">
    <!-- Fondo animado con ondas -->
    <div class="background-waves"></div>
    
    <!-- Encabezado mejorado -->
    <div class="header">
      <div class="header-icon">
        <svg viewBox="0 -960 960 960" fill="currentColor">
          <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
        </svg>
      </div>
      <h1 class="title">Central de Deudores BCRA</h1>
      <p class="subtitle">Sistema de Consulta SIISA - Análisis de Situación Financiera</p>
    </div>

    <!-- Formulario de búsqueda mejorado -->
    <div class="search-section">
      <div class="search-card">
        <div class="search-card-header">
          <h2 class="search-title">Nueva Consulta</h2>
          <div class="search-subtitle">Ingrese los datos de la persona a consultar</div>
        </div>
        <form @submit.prevent="consultarPersona" class="search-form">
          <div class="form-row">
            <div class="form-group">
              <label for="documento" class="label">
                <svg class="label-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/>
                </svg>
                DNI / CUIT
              </label>
              <input
                id="documento"
                v-model="formulario.documento"
                type="text"
                class="input"
                placeholder="DNI: 12345678 | CUIT: 30-70938201-9"
                :disabled="cargando"
                @input="limpiarResultados"
                maxlength="13"
              />
            </div>
            
            <div class="form-group">
              <label for="sexo" class="label">
                <svg class="label-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
                </svg>
                Sexo
              </label>
              <select
                id="sexo"
                v-model="formulario.sexo"
                class="input select"
                :disabled="cargando"
              >
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            class="btn btn-primary search-btn"
            :disabled="cargando || !formulario.documento.trim()"
          >
            <svg v-if="!cargando" class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
            </svg>
            <svg v-else class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
            </svg>
            {{ cargando ? 'Consultando BCRA...' : 'Consultar Situación' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Error -->
    <transition name="fade">
      <div v-if="error" class="alert-error">
        <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="alert-content">
          <h4 class="alert-title">Error en la consulta</h4>
          <p class="alert-message">{{ error }}</p>
        </div>
      </div>
    </transition>

    <!-- Resultados -->
    <transition name="slide-up">
      <div v-if="datosCompletos && !error" class="results-section">
        
        <!-- Header de Resultados con Info Personal -->
        <div class="results-header-card">
          <div class="person-avatar">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
            </svg>
          </div>
          <div class="person-header-info">
            <h2 class="person-name">{{ personaData?.ApellidoNombre || 'Sin datos' }}</h2>
            <div class="person-details">
              <span class="detail-item">
                <svg class="detail-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/>
                </svg>
                DNI {{ personaData?.NroDoc }}
              </span>
              <span class="detail-item">
                <svg class="detail-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790Z"/>
                </svg>
                CUIL {{ formatearCUIL(personaData?.Cuil) }}
              </span>
              <span class="detail-item">
                <svg class="detail-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/>
                </svg>
                {{ personaData?.Edad }} años
              </span>
            </div>
          </div>
          
          <!-- Semáforo grande -->
          <div v-if="datosCompletos?.semaforo" class="semaforo-badge" :class="`semaforo-${datosCompletos.semaforo.color}`">
            <div class="semaforo-circle-big"></div>
            <div class="semaforo-text">
              <!-- 'text' proviene de SIISA_COLORS; antes se usaba 'texto' y causaba undefined -->
              <div class="semaforo-status-big">{{ semaforoEstilos.text || 'Sin datos' }}</div>
              <div class="semaforo-sit">{{ datosCompletos.semaforo.situacion || 'Sin situación' }}</div>
            </div>
          </div>
          
          <!-- Scoring -->
          <div class="scoring-badge" v-if="scoringData">
            <div class="scoring-circle-header">
              <div class="scoring-value-header">{{ scoringData.score }}</div>
            </div>
            <div class="scoring-text">
              <div class="scoring-label-header">Score Crediticio</div>
              <div class="scoring-modelo">Modelo {{ scoringData.modelo }}</div>
            </div>
          </div>
        </div>

        <!-- Grid de tarjetas informativas -->
        <div class="info-grid">
          
          <!-- Resumen Financiero -->
          <div class="info-card featured">
            <div class="card-header-inline">
              <div class="card-title-group">
                <svg class="card-icon-big" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M640-520q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520Zm-320-80h200v-80H320v80ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Z"/>
                </svg>
                <div>
                  <h3 class="card-title-big">Resumen Financiero</h3>
                  <p class="card-subtitle">Situación crediticia actual</p>
                </div>
              </div>
            </div>
            <div class="financial-summary">
              <div class="summary-item total">
                <span class="summary-label">Deuda Total</span>
                <span class="summary-value">{{ formatearMonto(calcularMontoTotal()) }}</span>
              </div>
              <div class="summary-row">
                <div class="summary-item">
                  <span class="summary-label">Entidades</span>
                  <span class="summary-value small">{{ datosCompletos.semaforo.deudas?.length || 0 }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Score</span>
                  <span class="summary-value small score">{{ scoringData?.score || '-' }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Situación</span>
                  <span class="summary-value small">{{ semaforoEstilos.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información Personal -->
          <div class="info-card">
            <div class="card-header-inline">
              <svg class="card-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
              </svg>
              <h3 class="card-title">Datos Personales</h3>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="info-label-new">Sexo</span>
                <span class="info-value-new">{{ personaData?.Sexo === 'M' ? 'Masculino' : 'Femenino' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label-new">Nacimiento</span>
                <span class="info-value-new">{{ formatearFecha(personaData?.Fnac) }}</span>
              </div>
            </div>
          </div>

          <!-- Domicilio -->
          <div class="info-card" v-if="domicilioData">
            <div class="card-header-inline">
              <svg class="card-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
              </svg>
              <h3 class="card-title">Domicilio</h3>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="info-label-new">Dirección</span>
                <span class="info-value-new">{{ domicilioData.Direccion }}</span>
              </div>
              <div class="info-item">
                <span class="info-label-new">Localidad</span>
                <span class="info-value-new">{{ domicilioData.Localidad }}, {{ domicilioData.NombreProvincia }}</span>
              </div>
              <div class="info-item">
                <span class="info-label-new">CP</span>
                <span class="info-value-new">{{ domicilioData.CodPostal }}</span>
              </div>
            </div>
          </div>

          <!-- Información Laboral -->
          <div class="info-card" v-if="laboralData">
            <div class="card-header-inline">
              <svg class="card-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
              </svg>
              <h3 class="card-title">Situación Laboral</h3>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="info-label-new">Empresa</span>
                <span class="info-value-new">{{ laboralData.razonsocial }}</span>
              </div>
              <div class="info-item">
                <span class="info-label-new">Antigüedad</span>
                <span class="info-value-new">{{ laboralData.antiguedad }}</span>
              </div>
              <div class="info-item">
                <span class="info-label-new">Sector</span>
                <span class="info-value-new">{{ laboralData.sector }} - {{ laboralData.actividad }}</span>
              </div>
              <div class="info-item">
                <span class="info-label-new">Ingreso</span>
                <span class="info-value-new">{{ formatearFecha(laboralData.FechaIngreso) }}</span>
              </div>
            </div>
          </div>

          

        </div>

        <!-- Morosidades Comerciales (Sección) -->
        <div v-if="morosidadesComerciales.length" class="deudas-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg class="section-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M640-520q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520Zm-320-80h200v-80H320v80ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Z"/>
              </svg>
              Morosidades Comerciales
            </h3>
            <span class="section-badge">{{ morosidadesComerciales.length }} {{ morosidadesComerciales.length === 1 ? 'registro' : 'registros' }}</span>
          </div>

          <div class="deudas-grid">
            <div 
              v-for="(moro, idx) in morosidadesMostrar" 
              :key="idx" 
              class="deuda-card"
            >
              <div class="deuda-card-header">
                <div class="deuda-entidad-info">
                  <div class="deuda-icon-wrapper">
                    <svg viewBox="0 -960 960 960" fill="currentColor">
                      <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="deuda-entidad-name">{{ moro.entidad }}</h4>
                    <span class="deuda-origen-badge">Categoría {{ moro.categoria_id }} - {{ moro.categoria_nombre }}</span>
                  </div>
                </div>
                <div class="deuda-monto-big">Período {{ formatPeriodo(moro.periodo) }}</div>
              </div>

              <div class="deuda-card-body">
                <div class="deuda-info-row">
                  <div class="deuda-info-item" v-if="moro.region">
                    <span class="deuda-info-label">Región</span>
                    <span class="deuda-info-value">{{ moro.region }}</span>
                  </div>
                  <div class="deuda-info-item" v-if="moro.id_entidad">
                    <span class="deuda-info-label">ID Entidad</span>
                    <span class="deuda-info-value">{{ moro.id_entidad }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="morosidadesComerciales.length > 6" class="ver-mas-container" style="margin-top: 1rem;">
            <button class="btn btn-outline" @click="toggleMorosidades">
              {{ mostrarTodasMorosidades ? 'Ver menos' : `Ver más (${morosidadesComerciales.length - 6})` }}
            </button>
          </div>

          <div class="info-item" v-if="datosCompletos.semaforo.criterio_aplicado" style="margin-top: 1rem;">
            <span class="info-label-new">Criterio aplicado</span>
            <span class="info-value-new">{{ datosCompletos.semaforo.criterio_aplicado }}</span>
          </div>
        </div>

        <!-- Detalle de Deudas BCRA -->
        <div v-if="datosCompletos.semaforo.deudas && datosCompletos.semaforo.deudas.length > 0" class="deudas-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg class="section-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
              </svg>
              Deudas Reportadas en BCRA
            </h3>
            <span class="section-badge">{{ datosCompletos.semaforo.deudas.length }} {{ datosCompletos.semaforo.deudas.length === 1 ? 'deuda' : 'deudas' }}</span>
          </div>
          
          <div class="deudas-grid">
            <div 
              v-for="(deuda, index) in datosCompletos.semaforo.deudas" 
              :key="index" 
              class="deuda-card"
              :class="getSituacionClass(deuda.situacion)"
            >
              <div class="deuda-card-header">
                <div class="deuda-entidad-info">
                  <div class="deuda-icon-wrapper">
                    <svg viewBox="0 -960 960 960" fill="currentColor">
                      <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="deuda-entidad-name">{{ deuda.entidad }}</h4>
                    <span class="deuda-origen-badge">{{ deuda.origen }}</span>
                  </div>
                </div>
                <div class="deuda-monto-big">{{ formatearMonto(deuda.monto) }}</div>
              </div>
              
              <div class="deuda-card-body">
                <div class="deuda-info-row">
                  <div class="deuda-info-item">
                    <span class="deuda-info-label">Situación</span>
                    <span class="deuda-situacion-badge" :class="`sit-${deuda.situacion}`">
                      {{ deuda.situacion }}
                    </span>
                  </div>
                  <div class="deuda-info-item">
                    <span class="deuda-info-label">Período</span>
                    <span class="deuda-info-value">{{ deuda.periodo }}</span>
                  </div>
                  <div class="deuda-info-item" v-if="deuda.dias_atraso > 0">
                    <span class="deuda-info-label">Atraso</span>
                    <span class="deuda-atraso-value">{{ deuda.dias_atraso }} días</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </transition>
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

// Computed para acceder a datos_completos
const datosCompletos = computed(() => {
  return resultado.value?.datos_completos || null
})

const personaData = computed(() => {
  return datosCompletos.value?.data_completa?.DatosSalida?.Personas?.Persona || null
})

const domicilioData = computed(() => {
  return datosCompletos.value?.data_completa?.DatosSalida?.Domicilios?.Domicilio || null
})

const laboralData = computed(() => {
  return datosCompletos.value?.data_completa?.DatosSalida?.Laborales?.Laboral || null
})

const scoringData = computed(() => {
  return datosCompletos.value?.data_completa?.DatosSalida?.Scorings?.Scoring || null
})

const semaforoEstilos = computed(() => {
  if (!datosCompletos.value?.semaforo) return {}
  const proc = SiisaService.procesarSemaforo(datosCompletos.value.semaforo)
  // Asegurar propiedad 'text' para la vista; compatibilidad con 'texto'
  return {
    ...proc.estilos,
    text: proc.estilos.text || proc.estilos.texto || ''
  }
})

// Morosidades Comerciales toggle
const mostrarTodasMorosidades = ref(false)
const morosidadesComerciales = computed(() => datosCompletos.value?.semaforo?.morosidades_comerciales || [])
const morosidadesMostrar = computed(() => {
  if (mostrarTodasMorosidades.value) return morosidadesComerciales.value
  return morosidadesComerciales.value.slice(0, 6)
})

function toggleMorosidades() {
  mostrarTodasMorosidades.value = !mostrarTodasMorosidades.value
}

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
      formulario.value.documento.trim().replace(/-/g, ''),
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

function calcularMontoTotal() {
  if (!datosCompletos.value?.semaforo?.deudas) return 0
  return datosCompletos.value.semaforo.deudas.reduce((total, deuda) => total + deuda.monto, 0)
}

function formatearMonto(monto) {
  return SiisaService.formatearMonto(monto)
}

function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatearCUIL(cuil) {
  if (!cuil) return '-'
  const cuilStr = cuil.toString()
  return `${cuilStr.slice(0, 2)}-${cuilStr.slice(2, -1)}-${cuilStr.slice(-1)}`
}

function getSituacionClass(situacion) {
  if (situacion === 1) return 'situacion-normal'
  if (situacion === 2) return 'situacion-riesgo-bajo'
  if (situacion >= 3 && situacion <= 4) return 'situacion-riesgo-medio'
  return 'situacion-riesgo-alto'
}

function formatPeriodo(periodo) {
  if (!periodo) return '-'
  const str = String(periodo).replace('/', '')
  if (/^\d{6}$/.test(str)) {
    const year = str.slice(0, 4)
    const month = str.slice(4, 6)
    return `${month}/${year}`
  }
  return periodo
}
</script>

<style scoped>
/* Variables y Base */
.siisa-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
}

.background-waves {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: url('../assets/wave.svg') no-repeat bottom center;
  background-size: cover;
  opacity: 0.05;
  animation: wave-float 8s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes wave-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.02); }
}

/* Header Mejorado */
.header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
}

.header-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.header-icon svg {
  width: 48px;
  height: 48px;
  color: white;
}

.title {
  font-size: 2.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Search Card Mejorada */
.search-section {
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 2;
}

.search-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.search-card-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.search-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.search-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.input {
  padding: 0.875rem 1.125rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.input:hover {
  border-color: #cbd5e1;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: #94a3b8;
}

.input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
  opacity: 0.7;
}

.select {
  cursor: pointer;
}

.btn {
  padding: 0;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.search-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Alert Error */
.alert-error {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fca5a5;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #dc2626;
}

.alert-content {
  flex: 1;
}

.alert-title {
  margin: 0 0 0.5rem 0;
  color: #991b1b;
  font-size: 1.125rem;
  font-weight: 700;
}

.alert-message {
  margin: 0;
  color: #b91c1c;
  font-size: 0.95rem;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-enter-active {
  transition: all 0.4s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* Results Section */
.results-section {
  position: relative;
  z-index: 2;
}

/* Results Header Card - Info Personal Grande */
.results-header-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  overflow: hidden;
}

.results-header-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
}

.person-avatar {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.person-avatar svg {
  width: 56px;
  height: 56px;
  color: white;
}

.person-header-info {
  flex: 1;
}

.person-name {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.person-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

.detail-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

/* Semáforo Badge Grande */
.semaforo-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid;
  flex-shrink: 0;
}

.semaforo-verde {
  background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
  border-color: #22c55e;
  color: #16a34a;
}

.semaforo-amarillo {
  background: linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%);
  border-color: #eab308;
  color: #ca8a04;
}

.semaforo-rojo {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #ef4444;
  color: #dc2626;
}

.semaforo-circle-big {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 20px currentColor;
  animation: pulse-big 2s ease-in-out infinite;
}

@keyframes pulse-big {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.semaforo-text {
  text-align: left;
}

.semaforo-status-big {
  font-weight: 800;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.semaforo-sit {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Scoring Badge en Header */
.scoring-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  flex-shrink: 0;
}

.scoring-circle-header {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  flex-shrink: 0;
}

.scoring-value-header {
  font-size: 1.75rem;
  font-weight: 900;
  color: white;
  line-height: 1;
}

.scoring-text {
  text-align: left;
}

.scoring-label-header {
  font-weight: 800;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.scoring-modelo {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.info-card.featured {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #3b82f6;
}

.card-header-inline {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.card-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
  flex-shrink: 0;
}

.card-icon-big {
  width: 48px;
  height: 48px;
  color: #3b82f6;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-title-big {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.card-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label-new {
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
}

.info-value-new {
  color: #1e293b;
  font-weight: 600;
  text-align: right;
  font-size: 0.95rem;
}

/* Financial Summary */
.financial-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item.total {
  padding: 1.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 12px;
  color: white;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
}

.summary-value {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
}

.summary-value.small {
  font-size: 1.75rem;
}

.summary-value.score {
  color: #3b82f6;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.summary-row .summary-item {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.summary-row .summary-label {
  color: #64748b;
}

.summary-row .summary-value {
  color: #1e293b;
}

/* Deudas Section */
.deudas-section {
  margin-top: 2rem;
  position: relative;
  z-index: 2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.section-icon {
  width: 32px;
  height: 32px;
  color: #3b82f6;
}

.section-badge {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.875rem;
}

.deudas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.deuda-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.deuda-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.deuda-card.situacion-normal {
  border-left: 4px solid #22c55e;
}

.deuda-card.situacion-riesgo-bajo {
  border-left: 4px solid #eab308;
}

.deuda-card.situacion-riesgo-medio {
  border-left: 4px solid #f97316;
}

.deuda-card.situacion-riesgo-alto {
  border-left: 4px solid #ef4444;
}

.deuda-card-header {
  padding: 1.5rem;
  background: linear-gradient(to bottom, #f8fafc, white);
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.deuda-entidad-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.deuda-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.deuda-icon-wrapper svg {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.deuda-entidad-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.deuda-origen-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.deuda-monto-big {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
  text-align: right;
}

.deuda-card-body {
  padding: 1.5rem;
}

.deuda-info-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.deuda-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.deuda-info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.deuda-info-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.deuda-situacion-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-weight: 900;
  font-size: 1.125rem;
}

.sit-1 {
  background: #dcfce7;
  color: #16a34a;
}

.sit-2 {
  background: #fef9c3;
  color: #ca8a04;
}

.sit-3,
.sit-4 {
  background: #fed7aa;
  color: #ea580c;
}

.sit-5,
.sit-6 {
  background: #fecaca;
  color: #dc2626;
}

.deuda-atraso-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #dc2626;
}

/* Responsive */
@media (max-width: 1024px) {
  .deudas-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .siisa-container {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .header-icon {
    width: 60px;
    height: 60px;
  }
  
  .header-icon svg {
    width: 36px;
    height: 36px;
  }
  
  .results-header-card {
    flex-direction: column;
    text-align: center;
  }
  
  .person-avatar {
    width: 80px;
    height: 80px;
  }
  
  .person-name {
    font-size: 1.5rem;
  }
  
  .person-details {
    justify-content: center;
  }
  
  .semaforo-badge {
    width: 100%;
    justify-content: center;
  }
  
  .summary-row {
    grid-template-columns: 1fr;
  }
  
  .deudas-grid {
    gap: 1rem;
  }
}
</style>