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

/**
 * Agenda una visita verificando disponibilidad en jaula
 * @param {string} nroRto - Número de reparto
 * @param {string} fechaProxVisita - Fecha próxima visita (formato DD/MM/YYYY)
 * @param {number} cantDispensers - Cantidad de dispensers a agendar
 * @returns {Promise<boolean>} True si se puede agendar, false si no hay espacio
 */
export async function agendarVisita(nroRto, fechaProxVisita, cantDispensers) {
  // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD
  const [dia, mes, anio] = fechaProxVisita.split('/')
  const fechaFormateada = `${anio}-${mes}-${dia}`
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.JAULA_AGENDAR_VISITA, {
    idReparto: nroRto,
    fecha: fechaFormateada,
    cantidad: cantDispensers
  })
  
  return response.success || response
}
