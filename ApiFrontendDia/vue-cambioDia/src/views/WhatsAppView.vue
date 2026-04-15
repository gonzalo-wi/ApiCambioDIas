<template>
  <div class="whatsapp-container">
    <!-- Fondo con olas animadas -->
    <div class="background-waves"></div>

    <!-- Header Profesional -->
    <div class="whatsapp-header">
      <div class="header-icon-wrapper">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
      </div>
      <div class="header-content">
        <h1>Mensajería WhatsApp</h1>
        <p>Sistema de comunicación profesional para tu equipo de atención al cliente</p>
      </div>
      <!-- Status badge removido para vista productiva -->
    </div>
    <!-- Aviso de desarrollo removido para vista productiva -->

    <!-- Contenido Principal con Preview Bloqueado -->
    <div class="content-wrapper">
      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            :class="['tab', { active: modoActivo === 'individual' }]"
            @click="modoActivo = 'individual'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Envío Individual</span>
          </button>
          <button 
            :class="['tab', { active: modoActivo === 'masivo' }]"
            @click="modoActivo = 'masivo'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Envío Masivo</span>
          </button>
        </div>
      </div>

      <!-- Modo Individual -->
      <div v-if="modoActivo === 'individual'" class="content-card">
        <div class="card-header">
          <div class="header-icon-small">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 class="card-title">Enviar Mensaje Individual</h3>
            <p class="card-subtitle">Envía un mensaje personalizado a un contacto específico</p>
          </div>
        </div>
        
        <div class="card-body">
          <div v-if="successMessage || errorMessage" class="feedback-banner" :class="{ success: !!successMessage, error: !!errorMessage }">
            <svg v-if="successMessage" class="feedback-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="feedback-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ successMessage || errorMessage }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Número de WhatsApp
            </label>
              <input 
                v-model="numeroIndividual" 
                @input="handleIndividualInput" 
                type="tel" 
                placeholder="Completa después de 549..." 
                class="form-input"
              />
              <p class="form-hint">Prefijo 549 pre-cargado. Ingresa el resto del número sin el símbolo +</p>
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3zM12 11c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3z" />
              </svg>
              Nombre (opcional)
            </label>
            <input 
              v-model="nombreIndividual" 
              type="text" 
              placeholder="Ej: Juan"
              class="form-input"
            />
          </div>

          <div class="info-template">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="info-title">Se dispara un template preconfigurado</div>
              <div class="info-text">No es necesario escribir mensaje manual: el Flow de Infobip enviará el template definido.</div>
            </div>
          </div>

          <button class="btn-send" :disabled="enviando || !numeroValido" @click="sendIndividual">
            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            {{ enviando ? 'Enviando...' : 'Enviar Mensaje' }}
          </button>
        </div>
      </div>

      <!-- Modo Masivo -->
      <div v-if="modoActivo === 'masivo'" class="content-card">
        <div class="card-header">
          <div class="header-icon-small">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="card-title">Envío Masivo por CSV</h3>
            <p class="card-subtitle">Importa un archivo CSV y envía el mismo mensaje a múltiples contactos</p>
          </div>
        </div>
        
        <div class="card-body">
          <div v-if="successMessageMasivo || errorMessageMasivo" class="feedback-banner" :class="{ success: !!successMessageMasivo, error: !!errorMessageMasivo }">
            <svg v-if="successMessageMasivo" class="feedback-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="feedback-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ successMessageMasivo || errorMessageMasivo }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">
              <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Archivo CSV
            </label>
            <div class="file-upload-area">
              <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="upload-text">
                <span class="upload-highlight">Haz clic para seleccionar</span> o arrastra un archivo CSV aquí
              </p>
              <p class="upload-hint">El archivo debe contener una columna "numero" con los números de WhatsApp</p>
              <input ref="csvInput" type="file" accept=".csv" class="file-input" @change="onFileSelected" />
            </div>
            <div v-if="numerosCSV.length > 0" class="file-info">
              <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ numerosCSV.length }} números cargados correctamente</span>
            </div>
            <div v-if="erroresCSV.length > 0" class="file-info" style="background:#fef2f2;border-color:#fecaca;color:#7f1d1d;">
              <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ erroresCSV.length }} filas con error (se ignoran). Revísalas si es necesario.</span>
            </div>
          </div>

          <div class="info-template">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="info-title">Se usa template del Flow</div>
              <div class="info-text">El contenido se define en Infobip Moments; acá solo cargamos los destinatarios.</div>
            </div>
          </div>

          <div v-if="progresoEnvio.total > 0" class="progress-section">
            <div class="progress-info">
              <span class="progress-label">Progreso de envío</span>
              <span class="progress-numbers">{{ progresoEnvio.enviados }} / {{ progresoEnvio.total }}</span>
            </div>
            <div class="progress-bar-container">
              <div 
                class="progress-bar-fill" 
                :style="{ width: (progresoEnvio.enviados / progresoEnvio.total * 100) + '%' }"
              ></div>
            </div>
          </div>

          <button class="btn-send" :disabled="enviandoMasivo || numerosCSV.length === 0" @click="sendMasivo">
            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            {{ enviandoMasivo ? 'Enviando masivo...' : `Enviar a Todos (${numerosCSV.length} contactos)` }}
          </button>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WhatsappService from '../services/whatsappService'

const modoActivo = ref('individual')
const numeroIndividual = ref('549')
const nombreIndividual = ref('')
const mensajeIndividual = ref('')
const mensajeMasivo = ref('')
const numerosCSV = ref([]) // [{ phone, firstName? }]
const erroresCSV = ref([])
const progresoEnvio = ref({ enviados: 0, total: 0 })

const enviando = ref(false)
const enviandoMasivo = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const successMessageMasivo = ref('')
const errorMessageMasivo = ref('')
const csvInput = ref(null)

const numeroValido = computed(() => {
  const n = String(numeroIndividual.value || '').trim()
  return /^\d{10,15}$/.test(n)
})

function handleIndividualInput(e) {
  let digits = String(e.target.value || '').replace(/\D/g, '')
  if (!digits.startsWith('549')) {
    digits = '549' + digits.replace(/^549+/, '')
  }
  numeroIndividual.value = digits
}

async function sendIndividual() {
  try {
    enviando.value = true
    successMessage.value = ''
    errorMessage.value = ''
    await WhatsappService.sendParticipant({
      phone: numeroIndividual.value,
      firstName: nombreIndividual.value
    })
  successMessage.value = 'Enviado correctamente.'
  } catch (e) {
    console.error('Error enviando WhatsApp:', e)
    const data = e?.data || e
    const detail = data?.details?.response || data?.response || null
    if (detail) {
      try {
        errorMessage.value = (data?.error || data?.message || 'Error al enviar') + ' • ' + (detail?.message || JSON.stringify(detail))
      } catch {
        errorMessage.value = data?.error || data?.message || 'Error al enviar'
      }
    } else {
      errorMessage.value = data?.error || data?.message || 'Error al enviar'
    }
  } finally {
    enviando.value = false
  }
}

function parseCSV(text) {
  // Soporta separadores "," o ";" y encabezados: numero, nombre (opcional)
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length === 0) return { ok: [], err: [] }
  const sep = lines[0].includes(';') && !lines[0].includes(',') ? ';' : ','
  const header = lines[0].split(sep).map(h => h.trim().toLowerCase())
  const idxNumero = header.findIndex(h => ['numero', 'phone', 'telefono', 'whatsapp', 'identifier'].includes(h))
  const idxNombre = header.findIndex(h => ['nombre', 'firstName', 'firstname', 'name'].includes(h))
  const ok = []
  const err = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep).map(c => c.trim())
    const raw = idxNumero >= 0 ? cols[idxNumero] : cols[0]
    const name = idxNombre >= 0 ? cols[idxNombre] : ''
    const digits = String(raw || '').replace(/\D/g, '')
    if (!digits || digits.length < 10) {
      err.push({ line: i + 1, value: raw })
      continue
    }
    ok.push({ phone: digits, firstName: name || undefined })
  }
  return { ok, err }
}

async function onFileSelected(e) {
  const file = e.target?.files?.[0]
  if (!file) return
  const text = await file.text()
  const { ok, err } = parseCSV(text)
  numerosCSV.value = ok
  erroresCSV.value = err
}

async function sendMasivo() {
  if (numerosCSV.value.length === 0 || enviandoMasivo.value) return
  enviandoMasivo.value = true
  successMessageMasivo.value = ''
  errorMessageMasivo.value = ''
  const BATCH = 50
  const all = numerosCSV.value.slice()
  progresoEnvio.value = { enviados: 0, total: all.length }
  const fallidos = []
  try {
    for (let i = 0; i < all.length; i += BATCH) {
      const chunk = all.slice(i, i + BATCH)
      try {
        await WhatsappService.sendParticipants(chunk)
      } catch (err) {
        console.error('Fallo batch', i / BATCH, err)
        // Si falla el batch, intentamos individual para aislar fallidos
        for (const p of chunk) {
          try {
            await WhatsappService.sendParticipant(p)
          } catch (e) {
            fallidos.push(p)
          }
          progresoEnvio.value.enviados += 1
        }
        continue
      }
      progresoEnvio.value.enviados = Math.min(progresoEnvio.value.total, i + chunk.length)
      // Pequeña pausa para no saturar
      await new Promise(r => setTimeout(r, 200))
    }
    if (fallidos.length > 0) {
      errorMessageMasivo.value = `Completado con errores: ${fallidos.length} de ${progresoEnvio.value.total} no se enviaron.`
    } else {
      successMessageMasivo.value = 'Enviado correctamente.'
      // Reset para permitir nuevo archivo
      numerosCSV.value = []
      erroresCSV.value = []
      progresoEnvio.value = { enviados: 0, total: 0 }
      if (csvInput.value) {
        try { csvInput.value.value = '' } catch {}
      }
    }
  } catch (e) {
    console.error('Error en envío masivo', e)
    errorMessageMasivo.value = e?.message || 'Error en envío masivo'
  } finally {
    enviandoMasivo.value = false
  }
}
</script>

<style scoped>
.whatsapp-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem;
  position: relative;
  min-height: 100vh;
}

/* Feedback banner */
.feedback-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
}
.feedback-banner.success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}
.feedback-banner.error {
  background: #fef2f2;
  color: #7f1d1d;
  border: 1px solid #fecaca;
}
.feedback-icon {
  width: 20px;
  height: 20px;
}

/* Info template alert */
.info-template {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.info-template .info-icon {
  width: 20px;
  height: 20px;
  margin-top: 2px;
}
.info-template .info-title {
  font-weight: 600;
}
.info-template .info-text {
  font-size: 0.95rem;
  opacity: 0.9;
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
  background: radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(5, 150, 105, 0.04) 0%, transparent 50%);
  animation: wave 20s ease-in-out infinite;
}

.background-waves::after {
  background: radial-gradient(circle at 60% 70%, rgba(16, 185, 129, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(5, 150, 105, 0.03) 0%, transparent 50%);
  animation: wave 25s ease-in-out infinite reverse;
}

@keyframes wave {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -50px) rotate(5deg); }
  66% { transform: translate(-20px, 20px) rotate(-5deg); }
}

.whatsapp-container > * {
  position: relative;
  z-index: 1;
}

/* Header Profesional */
.whatsapp-header {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.3);
  position: relative;
  overflow: hidden;
}

.whatsapp-header::before {
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

.status-badge {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  color: #059669;
  padding: 0.875rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: pulse-badge 2s ease-in-out infinite;
  border: 2px solid rgba(5, 150, 105, 0.2);
}

.badge-icon {
  font-size: 1.25rem;
  animation: swing 2s ease-in-out infinite;
}

.badge-text {
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

@keyframes pulse-badge {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
  50% { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }
}

@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

/* Aviso de Desarrollo */
.coming-soon-notice {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.notice-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  color: #f59e0b;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem;
}

.notice-icon svg {
  width: 100%;
  height: 100%;
}

.notice-content h3 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
  font-size: 1.25rem;
  font-weight: 700;
}

.notice-content p {
  margin: 0;
  color: #78350f;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Content Wrapper con Overlay */
.content-wrapper {
  position: relative;
}

/* Tabs */
.tabs-container {
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0.75rem;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 12px;
}

.tab {
  flex: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
}

.tab svg {
  width: 22px;
  height: 22px;
}

.tab:hover {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.tab.active {
  background: white;
  color: #059669;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Content Card */
.content-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
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

/* Form Elements */
.form-group {
  margin-bottom: 1.75rem;
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
  color: #059669;
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.char-counter {
  text-align: right;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.file-upload-area:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.02);
}

.upload-icon {
  width: 56px;
  height: 56px;
  color: #9ca3af;
  margin: 0 auto 1rem;
}

.upload-text {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.upload-highlight {
  color: #059669;
  font-weight: 600;
}

.upload-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #9ca3af;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-info {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #065f46;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Progress Section */
.progress-section {
  margin: 1.75rem 0;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.progress-numbers {
  font-size: 0.9rem;
  font-weight: 700;
  color: #059669;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #059669 0%, #10b981 100%);
  transition: width 0.3s ease;
  border-radius: 10px;
}

/* Send Button */
.btn-send {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.btn-send:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Locked Overlay */
.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;
}

.overlay-content {
  text-align: center;
  padding: 2rem;
}

.overlay-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 1.5rem;
  color: #d1d5db;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.overlay-icon svg {
  width: 100%;
  height: 100%;
}

.overlay-content h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #374151;
}

.overlay-content p {
  margin: 0 0 1.5rem 0;
  font-size: 1.05rem;
  color: #6b7280;
}

.overlay-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  border: 2px solid #f59e0b;
}

.overlay-badge .badge-icon {
  font-size: 1.15rem;
}

/* Responsive */
@media (max-width: 768px) {
  .whatsapp-container {
    padding: 1.5rem;
  }

  .whatsapp-header {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .tabs {
    flex-direction: column;
  }

  .coming-soon-notice {
    flex-direction: column;
    text-align: center;
  }
}
</style>
