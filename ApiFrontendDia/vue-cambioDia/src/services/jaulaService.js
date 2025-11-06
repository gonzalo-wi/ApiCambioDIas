import { createHttpClient } from './api.client'
import { API_CONFIG } from '../config/api.config'

// Cliente HTTP para la API de El Jumillano
const jumillanoClient = createHttpClient(API_CONFIG.EXTERNAL_APIS.EL_JUMILLANO)

/**
 * Servicio para gestión de disponibilidad de jaulas
 */
export async function consultarDisponibilidadJaula(idReparto) {
  return jumillanoClient.get('/disponibilidad-jaula', { idReparto })
}

