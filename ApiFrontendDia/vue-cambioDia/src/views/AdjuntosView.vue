<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const GO_API_BASE = 'http://localhost:8080'

const mensajes = ref([])
const adjuntos = ref([])
const loading = ref(false)
const loadingAttachments = ref(false)
const error = ref(null)
const selectedCaseId = ref(null)

const defaultFrom = '2024-01-01'
const defaultTo = '2025-12-31'
const dateFrom = ref(defaultFrom)
const dateTo = ref(defaultTo)
const searchText = ref('')
const campaignFilter = ref('INSTALACION FRIO CALOR')

// Opciones de campaña disponibles
const campaignOptions = [
  { value: '', label: 'Todas las campañas' },
  { value: 'INSTALACION FRIO CALOR', label: 'Instalación Frío/Calor' },
  { value: 'Atención al cliente', label: 'Atención al cliente' }
]

// Filtrar mensajes por texto de búsqueda
const mensajesFiltrados = computed(() => {
  if (!searchText.value.trim()) return mensajes.value
  
  const search = searchText.value.toLowerCase()
  return mensajes.value.filter(msg => {
    return (
      msg.fromacc_account?.toLowerCase().includes(search) ||
      msg.fromacc_contact_name?.toLowerCase().includes(search) ||
      msg.content?.toLowerCase().includes(search) ||
      msg.case_id?.toLowerCase().includes(search)
    )
  })
})

async function buscarMensajes() {
  loading.value = true
  error.value = null
  mensajes.value = []
  adjuntos.value = []
  selectedCaseId.value = null
  
  try {
    const params = {
      date_from: `${dateFrom.value} 00:00:00`,
      date_to: `${dateTo.value} 23:59:59`,
      page_size: 100
    }
    
    if (campaignFilter.value) {
      params.campaign_name = campaignFilter.value
    }
    
    const response = await axios.get(`${GO_API_BASE}/api/s1/messages`, { params })
    
    if (response.data.success) {
      mensajes.value = response.data.data || []
    } else {
      error.value = 'No se pudieron obtener los mensajes'
    }
  } catch (err) {
    console.error('Error buscando mensajes:', err)
    error.value = 'Error al consultar los mensajes. Verifica que el servidor Go esté corriendo.'
  } finally {
    loading.value = false
  }
}

async function verAdjuntos(caseId) {
  selectedCaseId.value = caseId
  loadingAttachments.value = true
  adjuntos.value = []
  
  try {
    const params = {
      date_from: '2020-01-01 00:00:00',
      date_to: '2025-12-31 23:59:59',
      case_id: caseId,
      page_size: 100
    }
    
    console.log('🔍 Buscando adjuntos para case_id:', caseId)
    console.log('📋 Parámetros:', params)
    
    const response = await axios.get(`${GO_API_BASE}/api/s1/attachments`, { params })
    
    console.log('📦 Respuesta attachments:', response.data)
    
    if (response.data.success) {
      adjuntos.value = response.data.data || []
      console.log(`✅ ${adjuntos.value.length} adjuntos encontrados`)
    } else {
      console.log('❌ Respuesta no exitosa')
    }
  } catch (err) {
    console.error('❌ Error obteniendo adjuntos:', err)
    error.value = 'Error al consultar los adjuntos'
  } finally {
    loadingAttachments.value = false
  }
}

function limpiar() {
  dateFrom.value = defaultFrom
  dateTo.value = defaultTo
  searchText.value = ''
  campaignFilter.value = 'INSTALACION FRIO CALOR'
  mensajes.value = []
  adjuntos.value = []
  error.value = null
  selectedCaseId.value = null
}

function formatDate(datetime) {
  if (!datetime) return ''
  return new Date(datetime).toLocaleString('es-AR')
}
</script>

<template>
  <div class="adjuntos-page">
    <!-- Fondo con olas animadas -->
    <div class="background-waves"></div>
    
    <div class="container-sm">
      <div class="card fade-in">
        <!-- Header con logo -->
        <div class="header">
          <img src="@/assets/Ivess.png" alt="Logo Ivess" class="logo" />
          <h1 class="page-title">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            Búsqueda de Conversaciones y Adjuntos
          </h1>
        </div>

        <!-- Filtros de búsqueda -->
        <div class="filters-section">
          <div class="date-inputs">
            <div class="input-group">
              <label class="label">Fecha desde</label>
              <input type="date" v-model="dateFrom" class="input" />
            </div>
            <div class="input-group">
              <label class="label">Fecha hasta</label>
              <input type="date" v-model="dateTo" class="input" />
            </div>
          </div>

          <div class="input-group">
            <label class="label">Campaña</label>
            <select v-model="campaignFilter" class="input">
              <option v-for="option in campaignOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="action-buttons">
            <button @click="buscarMensajes" class="btn btn-primary" :disabled="loading">
              <svg v-if="!loading" class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
              <div v-else class="spinner spinner-sm"></div>
              {{ loading ? 'Buscando...' : 'Buscar Mensajes' }}
            </button>
            
            <button @click="limpiar" class="btn btn-outline" :disabled="loading">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Limpiar
            </button>
          </div>
        </div>

        <!-- Campo de filtro de texto -->
        <div v-if="mensajes.length" class="search-box">
          <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchText" 
            class="search-input" 
            placeholder="Filtrar por teléfono, nombre, contenido o case_id..."
          />
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span class="loading-text">Buscando mensajes...</span>
        </div>

        <!-- Error state -->
        <div v-if="error" class="alert-error">
          <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>

        <!-- Lista de mensajes -->
        <div v-if="mensajesFiltrados.length" class="results-section">
          <div class="results-header">
            <h2 class="results-title">Mensajes encontrados</h2>
            <span class="results-count">{{ mensajesFiltrados.length }} mensaje{{ mensajesFiltrados.length !== 1 ? 's' : '' }}</span>
          </div>
          
          <div class="messages-list">
            <div 
              v-for="msg in mensajesFiltrados" 
              :key="msg.message_id" 
              class="message-item"
              :class="{ 'selected': selectedCaseId === msg.case_id }"
            >
              <div class="message-header">
                <div class="message-contact">
                  <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <strong>{{ msg.fromacc_contact_name || 'Sin nombre' }}</strong>
                </div>
                <span class="message-date">{{ formatDate(msg.datetime) }}</span>
              </div>

              <div class="message-info">
                <div class="info-row">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ msg.fromacc_account }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Case ID:</span>
                  <span class="info-value case-id">{{ msg.case_id }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Canal:</span>
                  <span class="info-value">{{ msg.channel }}</span>
                </div>
              </div>

              <div v-if="msg.content" class="message-content">
                <p>{{ msg.content }}</p>
              </div>

              <button 
                @click="verAdjuntos(msg.case_id)" 
                class="btn btn-primary btn-sm"
                :disabled="loadingAttachments && selectedCaseId === msg.case_id"
              >
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
                {{ loadingAttachments && selectedCaseId === msg.case_id ? 'Cargando...' : 'Ver Adjuntos' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Lista de adjuntos -->
        <div v-if="adjuntos.length" class="attachments-section">
          <div class="attachments-header">
            <h3 class="attachments-title">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
              Adjuntos del Case {{ selectedCaseId }}
            </h3>
            <span class="attachments-count">{{ adjuntos.length }} archivo{{ adjuntos.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="attachments-grid">
            <div v-for="adjunto in adjuntos" :key="adjunto.att_id" class="attachment-card">
              <div class="attachment-preview">
                <img 
                  v-if="adjunto.att_type === 'image'" 
                  :src="adjunto.att_data" 
                  :alt="adjunto.att_name || 'Imagen'"
                  class="attachment-image"
                  @error="e => e.target.src = 'https://via.placeholder.com/150?text=Error'"
                />
                <div v-else-if="adjunto.att_type === 'video'" class="attachment-icon video">
                  <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                  </svg>
                </div>
                <div v-else class="attachment-icon document">
                  <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
              </div>
              
              <div class="attachment-info">
                <div class="attachment-type">{{ adjunto.att_type }}</div>
                <div class="attachment-date">{{ formatDate(adjunto.datetime) }}</div>
              </div>
              
              <a 
                :href="adjunto.att_data" 
                target="_blank" 
                class="btn btn-primary btn-block btn-sm"
              >
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Abrir
              </a>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay adjuntos pero se buscaron -->
        <div v-else-if="selectedCaseId && !loadingAttachments" class="alert-info">
          <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          No se encontraron adjuntos para el Case {{ selectedCaseId }}
        </div>

        <!-- Empty state mensajes -->
        <div v-else-if="!loading && !error && !mensajes.length" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          <h3 class="empty-title">Busca conversaciones</h3>
          <p class="empty-description">Selecciona un rango de fechas y haz clic en "Buscar Mensajes" para comenzar.</p>
        </div>

        <!-- Empty state filtrado -->
        <div v-else-if="!loading && mensajes.length && !mensajesFiltrados.length" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
          </svg>
          <h3 class="empty-title">Sin resultados</h3>
          <p class="empty-description">No hay mensajes que coincidan con "{{ searchText }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adjuntos-page {
  min-height: 100vh;
  padding: 2rem 0;
  position: relative;
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
  pointer-events: none;
}

@keyframes wave-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

.container-sm {
  position: relative;
  z-index: 2;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.filters-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--gray-200);
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-group:last-child {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 2px solid var(--blue-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: var(--gray-700);
}

.search-input::placeholder {
  color: var(--gray-400);
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

.spinner-sm {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.results-section {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--gray-200);
}

.results-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--blue-800);
}

.results-count {
  background: var(--blue-100);
  color: var(--blue-700);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.message-item:hover {
  border-color: var(--blue-300);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.message-item.selected {
  border-color: var(--blue-500);
  background: var(--blue-50);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
}

.message-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--blue-700);
  font-size: 1.125rem;
}

.message-date {
  color: var(--gray-500);
  font-size: 0.875rem;
}

.message-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.info-label {
  color: var(--gray-500);
  font-weight: 500;
}

.info-value {
  color: var(--gray-700);
}

.case-id {
  font-family: monospace;
  background: var(--gray-100);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.message-content {
  background: var(--gray-50);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  border-left: 3px solid var(--blue-400);
}

.message-content p {
  margin: 0;
  color: var(--gray-700);
  line-height: 1.5;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-block {
  width: 100%;
}

.attachments-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--blue-50);
  border: 2px solid var(--blue-200);
  border-radius: var(--border-radius-lg);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.attachments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.attachments-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--blue-800);
}

.attachments-count {
  background: var(--blue-200);
  color: var(--blue-800);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.attachment-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.attachment-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.attachment-preview {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border-radius: var(--border-radius);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.attachment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.attachment-icon.video {
  background: var(--blue-100);
  color: var(--blue-600);
}

.attachment-icon.document {
  background: var(--gray-200);
  color: var(--gray-600);
}

.attachment-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
}

.attachment-type {
  background: var(--blue-100);
  color: var(--blue-700);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  text-transform: uppercase;
}

.attachment-date {
  color: var(--gray-500);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500);
}

.alert-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--blue-50);
  border: 1px solid var(--blue-200);
  border-radius: var(--border-radius-lg);
  color: var(--blue-700);
  margin-top: 1rem;
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
  margin-bottom: 0.5rem;
}

.empty-description {
  font-size: 1rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .date-inputs {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .results-header,
  .attachments-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .message-info {
    grid-template-columns: 1fr;
  }
  
  .attachments-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .adjuntos-page {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .filters-section {
    padding: 1rem;
  }

  .message-item {
    padding: 1rem;
  }
}
</style>