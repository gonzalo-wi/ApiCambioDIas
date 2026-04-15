<template>
  <div class="consultar-token-container">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">
        <span class="material-symbols-outlined">key</span>
      </div>
      <div>
        <h1 class="title">Consultar Token</h1>
        <p class="subtitle">Buscar token de entrega Dispenser F/C por cuenta y fecha</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="form-card">
      <div class="form-card-header">
        <span class="material-symbols-outlined form-card-icon">manage_search</span>
        <span>Datos de búsqueda</span>
      </div>
      <form @submit.prevent="consultarToken" class="form">
        <div class="form-row">
          <div class="form-group">
            <label class="label">
              <span class="material-symbols-outlined label-icon">account_circle</span>
              Número de Cuenta
            </label>
            <input
              v-model="nroCta"
              type="text"
              class="input"
              placeholder="Ej: 43534"
              :disabled="cargando"
            />
          </div>
          <div class="form-group">
            <label class="label">
              <span class="material-symbols-outlined label-icon">calendar_month</span>
              Fecha de Acción
            </label>
            <input
              v-model="fechaAccion"
              type="date"
              class="input"
              :disabled="cargando"
            />
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="cargando || !nroCta.trim() || !fechaAccion"
        >
          <svg v-if="!cargando" class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
          <svg v-else class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
          </svg>
          {{ cargando ? 'Consultando...' : 'Buscar Token' }}
        </button>
      </form>
    </div>

    <!-- Resultado -->
    <transition name="slide-up">
      <div v-if="resultado" class="result-section">
        <!-- Token destacado -->
        <div class="token-card">
          <div class="token-badge">
            <span class="material-symbols-outlined token-badge-icon">verified</span>
            <span>Token Encontrado</span>
          </div>
          <div class="token-display">
            <span class="token-digits">{{ resultado.token }}</span>
          </div>
          <button class="btn-copy" @click="copiarToken" :class="{ copied: copiado }">
            <span class="material-symbols-outlined">{{ copiado ? 'check' : 'content_copy' }}</span>
            {{ copiado ? 'Copiado' : 'Copiar token' }}
          </button>
        </div>

        <!-- Detalles -->
        <div class="details-card">
          <div class="details-header">
            <span class="material-symbols-outlined">info</span>
            <span>Detalles de la consulta</span>
          </div>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-icon material-symbols-outlined">account_circle</span>
              <div>
                <span class="detail-label">Nro. Cuenta</span>
                <span class="detail-value">{{ resultado.nro_cta }}</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon material-symbols-outlined">calendar_month</span>
              <div>
                <span class="detail-label">Fecha de Acción</span>
                <span class="detail-value">{{ formatFecha(resultado.fecha_accion) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Sin resultado -->
    <transition name="slide-up">
      <div v-if="sinResultado" class="empty-state">
        <div class="empty-icon-wrapper">
          <span class="material-symbols-outlined empty-icon">search_off</span>
        </div>
        <h3 class="empty-title">Sin Resultados</h3>
        <p class="empty-text">No se encontró un token para la cuenta <strong>{{ nroCta }}</strong> en la fecha indicada.</p>
      </div>
    </transition>

    <!-- Error -->
    <transition name="fade">
      <div v-if="error" class="alert-error">
        <span class="material-symbols-outlined alert-icon">error</span>
        <div>
          <p class="alert-title">Error en la consulta</p>
          <p class="alert-text">{{ error }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiClient } from '@/services/api.client'
import { API_CONFIG } from '@/config/api.config'

const nroCta = ref('')
const fechaAccion = ref('')
const cargando = ref(false)
const resultado = ref(null)
const sinResultado = ref(false)
const error = ref(null)
const copiado = ref(false)

function formatFecha(fecha) {
  if (!fecha) return ''
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

async function copiarToken() {
  if (!resultado.value?.token) return
  try {
    await navigator.clipboard.writeText(resultado.value.token)
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 2000)
  } catch { /* ignore */ }
}

async function consultarToken() {
  cargando.value = true
  resultado.value = null
  sinResultado.value = false
  error.value = null

  try {
    const params = new URLSearchParams({
      fecha_accion: fechaAccion.value,
      nro_cta: nroCta.value
    })
    const data = await apiClient.get(`${API_CONFIG.ENDPOINTS.CONSULTAR_TOKEN_FC}?${params}`)
    
    if (data && data.token) {
      resultado.value = data
    } else {
      sinResultado.value = true
    }
  } catch (err) {
    console.error('❌ Error consultando token:', err)
    if (err.status === 404) {
      sinResultado.value = true
    } else {
      error.value = err.message || 'Error al consultar el token'
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.consultar-token-container {
  max-width: 750px;
  margin: 0 auto;
  padding: 2rem;
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-radius: 18px;
  color: white;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
}

.header-icon .material-symbols-outlined {
  font-size: 30px;
}

.title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0.3rem 0 0;
}

/* ===== Form Card ===== */
.form-card {
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.form-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.form-card-icon {
  font-size: 20px;
  color: #6366f1;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.label-icon {
  font-size: 18px;
  color: #6366f1;
}

.input {
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s;
  outline: none;
  background: #fafbfc;
}

.input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  background: white;
}

.input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.75rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== Token Card ===== */
.result-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.token-card {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%);
  border: 2px solid #a5b4fc;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.token-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.token-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.token-badge-icon {
  font-size: 18px;
  color: #22c55e;
}

.token-display {
  margin: 0.75rem 0 1.25rem;
}

.token-digits {
  font-size: 3.5rem;
  font-weight: 900;
  color: #312e81;
  letter-spacing: 12px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(49, 46, 129, 0.15);
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  border: 2px solid #a5b4fc;
  background: white;
  color: #4f46e5;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.btn-copy.copied {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}

.btn-copy .material-symbols-outlined {
  font-size: 18px;
}

/* ===== Details Card ===== */
.details-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.details-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.details-header .material-symbols-outlined {
  font-size: 18px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
}

.detail-icon {
  font-size: 22px;
  color: #6366f1;
  opacity: 0.7;
}

.detail-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 0.15rem;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  margin-top: 1.5rem;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
}

.empty-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: #fef3c7;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 36px;
  color: #f59e0b;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.empty-text {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

/* ===== Error Alert ===== */
.alert-error {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: linear-gradient(135deg, #fef2f2, #fff1f2);
  border: 1px solid #fecaca;
  border-radius: 16px;
  padding: 1.25rem;
  margin-top: 1.5rem;
}

.alert-icon {
  font-size: 24px;
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-title {
  margin: 0 0 0.25rem;
  font-weight: 700;
  color: #991b1b;
  font-size: 0.9rem;
}

.alert-text {
  margin: 0;
  color: #dc2626;
  font-size: 0.85rem;
}

/* ===== Transitions ===== */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .consultar-token-container {
    padding: 1rem;
  }

  .form-row,
  .details-grid {
    grid-template-columns: 1fr;
  }

  .token-digits {
    font-size: 2.5rem;
    letter-spacing: 8px;
  }
}
</style>
