import { createHttpClient } from './api.client'
import { API_CONFIG } from '../config/api.config'

// Cliente HTTP que usa el proxy (BASE_URL = http://192.168.0.250:3002)
const apiClient = createHttpClient(API_CONFIG.BASE_URL)

/**
 * Servicio para gestión de disponibilidad de jaulas
 */
export async function consultarDisponibilidadJaula(idReparto) {
  return apiClient.get(API_CONFIG.ENDPOINTS.JAULA_DISPONIBILIDAD, { idReparto })
}

