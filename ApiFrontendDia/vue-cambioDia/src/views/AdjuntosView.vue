<script setup>
import { ref } from 'vue'
import { fetchAttachment } from '@/services/attachmentService'

const adjuntos = ref([])
const loading = ref(false)
const error = ref(null)

const defaultFrom = '2025-01-01'
const defaultTo = '2025-01-05'
const dateFrom = ref(defaultFrom)
const dateTo = ref(defaultTo)

async function buscar() {
  loading.value = true
  error.value = null
  try {
    adjuntos.value = await fetchAttachment({
      date_from: `${dateFrom.value} 00:00:00`,
      date_to: `${dateTo.value} 23:59:59`
    })
  } catch (err) {
    error.value = 'Hubo un error al consultar los datos.'
  } finally {
    loading.value = false
  }
}

function limpiar() {
  dateFrom.value = defaultFrom
  dateTo.value = defaultTo
  adjuntos.value = []
  error.value = null
}
</script>

<template>
  <div class="adjuntos-page">
    <div class="container-sm">
      <div class="card fade-in">
        <!-- Header con logo -->
        <div class="header">
          <img src="@/assets/Ivess.png" alt="Logo Ivess" class="logo" />
          <h1 class="page-title">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Consulta de Documentación Adjunta
          </h1>
        </div>

        <!-- Filtros de fecha -->
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
          
          <div class="action-buttons">
            <button @click="buscar" class="btn btn-primary" :disabled="loading">
              <svg v-if="!loading" class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
              <div v-else class="spinner spinner-sm"></div>
              {{ loading ? 'Buscando...' : 'Buscar' }}
            </button>
            
            <button @click="limpiar" class="btn btn-outline" :disabled="loading">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Limpiar
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span class="loading-text">Cargando adjuntos...</span>
        </div>

        <!-- Error state -->
        <div v-if="error" class="alert-error">
          <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>

        <!-- Results -->
        <div v-if="adjuntos.length" class="results-section">
          <div class="results-header">
            <h2 class="results-title">Adjuntos encontrados</h2>
            <span class="results-count">{{ adjuntos.length }} documento{{ adjuntos.length !== 1 ? 's' : '' }}</span>
          </div>
          
          <div class="results-list">
            <div v-for="adjunto in adjuntos" :key="adjunto.att_id" class="result-item">
              <div class="file-icon">
                <svg v-if="adjunto.att_type?.includes('pdf')" class="icon text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <svg v-else class="icon text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              
              <div class="file-info">
                <a :href="adjunto.att_data" target="_blank" class="file-link">
                  {{ adjunto.att_name }}
                </a>
                <div class="file-meta">
                  <span class="file-type">{{ adjunto.att_type }}</span>
                  <span class="file-date">{{ adjunto.datetime }}</span>
                </div>
              </div>
              
              <div class="file-actions">
                <a :href="adjunto.att_data" target="_blank" class="btn-icon" title="Abrir archivo">
                  <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading && !error" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="empty-title">No hay adjuntos disponibles</h3>
          <p class="empty-description">No se encontraron documentos para el rango de fechas seleccionado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adjuntos-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--blue-800);
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
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.result-item:hover {
  border-color: var(--blue-300);
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.file-icon {
  flex-shrink: 0;
}

.text-red-600 {
  color: #dc2626;
}

.text-blue-600 {
  color: var(--blue-600);
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-link {
  display: block;
  font-weight: 600;
  color: var(--blue-700);
  text-decoration: none;
  margin-bottom: 0.25rem;
  transition: color 0.2s ease;
}

.file-link:hover {
  color: var(--blue-800);
  text-decoration: underline;
}

.file-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray-500);
}

.file-type {
  background: var(--gray-100);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.file-actions {
  flex-shrink: 0;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--blue-50);
  color: var(--blue-600);
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--blue-100);
  color: var(--blue-700);
  transform: scale(1.1);
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
  
  .results-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .file-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .file-actions {
    align-self: flex-end;
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
}
</style>