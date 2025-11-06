<template>
  <div class="token-container">
    <!-- Fondo con olas animadas -->
    <div class="background-waves"></div>
    
    <!-- Contenido principal -->
    <div class="token-content">
      <!-- Encabezado -->
      <div class="header-section">
        <div class="icon-container">
          <svg class="key-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z">
            </path>
          </svg>
        </div>
        
        <h1 class="title">Generador de Token</h1>
        <p class="subtitle">
          Sistema de generación de claves de acceso para dispensers frío/calor
        </p>
      </div>

      <!-- Card principal -->
      <div class="main-card">
        <div class="card-body">
          <!-- Instrucciones -->
          <div class="instructions-box">
            <div class="info-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
            </div>
            <p class="instructions-text">
              Genera un token único para entregar al cliente. Este código le permitirá 
              activar y recibir el dispenser de agua frío/calor.
            </p>
          </div>

          <!-- Botón de generar -->
          <div class="action-section">
            <button 
              @click="generarToken" 
              :disabled="loading"
              class="generate-btn"
            >
              <svg v-if="loading" class="btn-spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                </path>
              </svg>
              {{ loading ? 'Generando...' : 'Generar Nuevo Token' }}
            </button>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="error-alert">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
            {{ error }}
          </div>

          <!-- Resultado del token -->
          <div v-if="token" class="result-card">
            <div class="result-header">
              <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
              <h3>Token Generado Exitosamente</h3>
            </div>
            
            <div class="token-display">
              <div class="token-label">Código de Acceso</div>
              <div class="token-code">{{ formattedToken }}</div>
              <button @click="copiarToken" class="copy-btn">
                <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                  </path>
                </svg>
                {{ copiado ? 'Copiado!' : 'Copiar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TokenService } from '../services/tokenService'

const token = ref('')
const loading = ref(false)
const error = ref('')
const copiado = ref(false)

const formattedToken = computed(() => {
  if (!token.value) return ''
  // formato 222296 -> 222-296
  const t = token.value.replace(/[^0-9]/g, '')
  if (t.length >= 6) return `${t.slice(0,3)}-${t.slice(3,6)}`
  return token.value
})

async function generarToken() {
  error.value = ''
  token.value = ''
  copiado.value = false
  loading.value = true
  try {
    const res = await TokenService.getToken()
    if (res && res.token) {
      token.value = res.token
    } else {
      error.value = 'Respuesta inválida del servidor'
    }
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Error al generar token. Verifica que el backend esté activo.'
  } finally {
    loading.value = false
  }
}

async function copiarToken() {
  try {
    await navigator.clipboard.writeText(formattedToken.value)
    copiado.value = true
    setTimeout(() => copiado.value = false, 2000)
  } catch (e) {
    console.error('Error al copiar:', e)
  }
}
</script>

<style scoped>
.token-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
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
}

@keyframes wave-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

.token-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.key-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

.main-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
  overflow: hidden;
}

.coming-soon-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-bottom: 3px solid #d97706;
}

.banner-icon {
  width: 48px;
  height: 48px;
  color: white;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.banner-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 500;
}

.disabled-content {
  opacity: 0.6;
  pointer-events: none;
  filter: grayscale(0.3);
}

.btn-disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%) !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}

.btn-disabled:hover {
  transform: none !important;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4) !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-body {
  padding: 3rem;
}

.instructions-box {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e0e7ff 0%, #e9d5ff 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.info-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #7c3aed;
}

.instructions-text {
  margin: 0;
  color: #5b21b6;
  line-height: 1.6;
  font-size: 0.95rem;
}

.action-section {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.generate-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-weight: 500;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.result-card {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #86efac;
  border-radius: 16px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.success-icon {
  width: 28px;
  height: 28px;
  color: #16a34a;
}

.result-header h3 {
  margin: 0;
  color: #166534;
  font-size: 1.3rem;
  font-weight: 600;
}

.token-display {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.token-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.token-code {
  font-size: 3rem;
  font-weight: 800;
  color: #7c3aed;
  letter-spacing: 0.5rem;
  font-family: 'Courier New', monospace;
  margin: 1rem 0;
  text-shadow: 0 2px 4px rgba(124, 58, 237, 0.1);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #7c3aed;
  background: #f5f3ff;
  border: 1px solid #c4b5fd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #ede9fe;
  border-color: #a78bfa;
}

.copy-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .token-content {
    padding: 2rem 1rem;
  }

  .card-body {
    padding: 2rem 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .token-code {
    font-size: 2rem;
    letter-spacing: 0.3rem;
  }
}
</style>
