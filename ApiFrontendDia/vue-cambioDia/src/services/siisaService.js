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
    try {
      console.log('🔑 Obteniendo token SIISA...')
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.SIISA_TOKEN)
      console.log('✅ Respuesta token:', response)
      
      // La respuesta puede ser { token: "..." } o el token directamente
      const token = response.token || response
      console.log('🎫 Token extraído:', token ? 'SI' : 'NO')
      
      return token
    } catch (error) {
      console.error('❌ Error obteniendo token SIISA:', error)
      throw error
    }
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
    
    console.log('📝 Consultando SIISA con token:', token ? 'SI' : 'NO')
    
    // Construimos los parámetros
    const params = { documento, token }
    if (sexo) params.sexo = sexo
    
    // Realizamos la consulta (el proxy enviará el token como Bearer)
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.SIISA_CONSULTA,
      params
    )

    console.log('✅ Respuesta SIISA completa:', response)
    console.log('📊 Estructura:', {
      success: response.success,
      hasData: !!response.data,
      hasTexto: !!response.texto,
      hasSemaforo: !!response.semaforo,
      keys: Object.keys(response)
    })

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