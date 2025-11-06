import { createHttpClient } from './api.client'
import { API_CONFIG } from '../config/api.config'
import { SIISA_COLORS } from '../constants'

// Cliente HTTP que usa el proxy (BASE_URL = http://192.168.0.250:3002)
const apiClient = createHttpClient(API_CONFIG.BASE_URL)

/**
 * Servicio para consultas SIISA (Sistema de Información de Salud Argentina)
 */
export class SiisaService {
  /**
   * Obtiene el token de autenticación para SIISA
   * @returns {Promise<string>} Token de acceso
   */
  static async obtenerToken() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SIISA_TOKEN)
    return response.token
  }

  /**
   * Consulta los datos financieros de una persona en SIISA
   * @param {string} documento - Número de documento (DNI)
   * @param {string} sexo - Sexo de la persona (M/F - opcional)
   * @returns {Promise<Object>} Respuesta de SIISA
   */
  static async consultarPersona(documento, sexo = '') {
    // Primero obtenemos el token
    const token = await this.obtenerToken()
    
    // Construimos los parámetros
    const params = { documento, token }
    if (sexo) params.sexo = sexo
    
    // Realizamos la consulta (el proxy enviará el token como Bearer)
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.SIISA_CONSULTA,
      params
    )

    // Verificamos que la consulta fue exitosa
    if (!response.success) {
      throw new Error('La consulta a SIISA no fue exitosa')
    }
    
    return response
  }

  /**
   * Determina el color del semáforo según la situación financiera
   * @param {Object} semaforo - Objeto semáforo de la respuesta
   * @returns {Object} Información del semáforo procesada
   */
  static procesarSemaforo(semaforo) {
    return {
      ...semaforo,
      estilos: SIISA_COLORS[semaforo.color] || SIISA_COLORS.rojo
    }
  }
}