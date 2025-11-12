import { createHttpClient } from './api.client'
import { API_CONFIG } from '../config/api.config'
import { SIISA_COLORS, SIISA_SITUACION_LABELS } from '../constants'

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
      hasDatosCompletos: !!response.datos_completos,
      hasTexto: !!response.texto,
      hasSemaforo: !!response.semaforo,
      keys: Object.keys(response)
    })
    
    if (response.datos_completos) {
      console.log('📋 Datos completos:', response.datos_completos)
      console.log('🔑 Keys en datos_completos:', Object.keys(response.datos_completos))
    }

    // Verificamos que la consulta fue exitosa
    if (!response.success) {
      throw new Error('La consulta a SIISA no fue exitosa')
    }
    
    // Adaptar/normalizar estructura para la vista
    return normalizeSiisaResponse(response)
  }

  /**
   * Determina el color del semáforo según la situación financiera
   * @param {Object} semaforo - Objeto semáforo de la respuesta
   * @returns {Object} Información del semáforo procesada
   */
  static procesarSemaforo(semaforo) {
    const estilos = SIISA_COLORS[semaforo.color?.toUpperCase?.()] || SIISA_COLORS.ROJO
    // Derivar texto legible del color
    const textMap = { VERDE: 'Aprobado', AMARILLO: 'Revisar', ROJO: 'Riesgo' }
    const text = textMap[semaforo.color?.toUpperCase?.()] || 'Estado'
    return {
      ...semaforo,
      estilos: { ...estilos, text }
    }
  }

  /**
   * Formatea un monto en formato de moneda argentina
   * @param {number} monto - Monto a formatear
   * @returns {string} Monto formateado
   */
  static formatearMonto(monto) {
    if (!monto && monto !== 0) return '$0'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto)
  }
}

// Helper: normaliza respuesta de SIISA a contrato estable para la vista
function normalizeSiisaResponse(resp) {
  // Esperado actual: { success, documento_consultado, sexo_filtro, datos_completos, metadata }
  const datos = resp?.datos_completos || null
  const semaforo = datos?.semaforo || null
  const dataCompleta = datos?.data_completa || null

  // Normalizar campos derivados para la vista
  const situacionMaxBcra = semaforo?.situacion_maxima_bcra
  const situacionMaxLabel = typeof situacionMaxBcra === 'number'
    ? (SIISA_SITUACION_LABELS[situacionMaxBcra] || `Situación ${situacionMaxBcra}`)
    : undefined

  const normalized = {
    success: !!resp?.success,
    documento_consultado: resp?.documento_consultado || '',
    sexo_filtro: resp?.sexo_filtro || '',
    // Mantener la misma llave usada por la vista
    datos_completos: {
      ...datos,
      semaforo: {
        color: semaforo?.color || 'ROJO',
        situacion: semaforo?.situacion || 'Sin datos',
        deudas: semaforo?.deudas || [],
        morosidades_comerciales: semaforo?.morosidades_comerciales || [],
        situaciones_encontradas: semaforo?.situaciones_encontradas || [],
        criterio_aplicado: semaforo?.criterio_aplicado || '',
        situacion_maxima_bcra: situacionMaxBcra,
        categoria_maxima_morosidad: semaforo?.categoria_maxima_morosidad,
        // Etiqueta legible que usa la vista
        situacion_maxima_label: situacionMaxLabel,
      },
      data_completa: dataCompleta || {},
    },
    metadata: resp?.metadata || {}
  }

  return normalized
}