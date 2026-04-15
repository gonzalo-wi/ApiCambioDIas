import { API_CONFIG } from '../config/api.config'
import { createHttpClient } from './api.client'

// Debe recibir BASE_URL, no el objeto completo; evita URLs del tipo [object Object]/...
const http = createHttpClient(API_CONFIG.BASE_URL)

// Endpoint seguro (fallback) y logging para depuración en runtime
const WHATSAPP_ENDPOINT = (API_CONFIG && API_CONFIG.ENDPOINTS && API_CONFIG.ENDPOINTS.WHATSAPP_PARTICIPANTS) || '/api/whatsapp/participants'

function _logRequest(endpoint) {
  try {
    // eslint-disable-next-line no-console
    console.log('[whatsappService] baseURL=', API_CONFIG.BASE_URL, ' endpoint=', endpoint)
  } catch (e) {
    // ignore
  }
}

function buildParticipant({ phone, firstName }) {
  if (!phone) throw new Error('El número de WhatsApp es requerido')
  // Sanitizar y forzar formato E.164 (+ prefijo)
  const onlyDigits = String(phone).trim().replace(/\D/g, '')
  const e164 = onlyDigits.startsWith('+') ? onlyDigits : `+${onlyDigits}`
  const participant = {
    identifyBy: 'PHONE_NUMBER',
    contactInformation: {
      phone: { number: e164 },
      phoneNumber: e164
    }
  }
  if (firstName && String(firstName).trim().length > 0) {
    participant.person = { firstName: String(firstName).trim() }
  }
  return participant
}

export default {
  // Enviar un único participante al flow de Moments
  async sendParticipant({ phone, firstName } = {}) {
    const body = { participants: [buildParticipant({ phone, firstName })] }
    const endpoint = WHATSAPP_ENDPOINT
    _logRequest(endpoint)
    return http.post(endpoint, body)
  },

  // Enviar múltiples participantes (ej: CSV ya parseado)
  async sendParticipants(list = []) {
    const participants = list.map(buildParticipant)
    const body = { participants }
    const endpoint = WHATSAPP_ENDPOINT
    _logRequest(endpoint)
    return http.post(endpoint, body)
  },

  // Enviar cuerpo crudo por si se requiere otra variante de Infobip
  async sendRaw(body) {
    const endpoint = WHATSAPP_ENDPOINT
    _logRequest(endpoint)
    return http.post(endpoint, body)
  }
}
