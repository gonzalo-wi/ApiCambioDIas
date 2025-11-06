import { ERROR_MESSAGES } from '../constants'

/**
 * Clase para manejar errores de la aplicación
 */
export class AppError extends Error {
  constructor(message, code, originalError = null) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.originalError = originalError
    this.timestamp = new Date()
  }

  /**
   * Convierte el error a formato JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

/**
 * Convierte errores de API a mensajes amigables
 * @param {Error} error - Error a procesar
 * @returns {string} Mensaje amigable
 */
export function getErrorMessage(error) {
  if (!error) return ERROR_MESSAGES.GENERIC
  
  // Si es un AppError o ApiError con mensaje personalizado
  if (error.message && error.message !== 'Failed to fetch') {
    return error.message
  }
  
  // Errores de red
  if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
    return ERROR_MESSAGES.NETWORK
  }
  
  // Errores por código de estado
  if (error.status) {
    switch (error.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED
      case 403:
        return ERROR_MESSAGES.FORBIDDEN
      case 404:
        return ERROR_MESSAGES.NOT_FOUND
      case 408:
      case 504:
        return ERROR_MESSAGES.TIMEOUT
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER
      default:
        return error.data?.message || ERROR_MESSAGES.GENERIC
    }
  }
  
  // Timeout
  if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
    return ERROR_MESSAGES.TIMEOUT
  }
  
  return ERROR_MESSAGES.GENERIC
}

/**
 * Maneja errores de forma centralizada
 * @param {Error} error - Error a manejar
 * @param {Object} options - Opciones de manejo
 * @returns {Object} Objeto con información del error
 */
export function handleError(error, options = {}) {
  const {
    showNotification = true,
    logToConsole = true,
    context = ''
  } = options
  
  const errorMessage = getErrorMessage(error)
  const errorCode = error.status || error.code || 'UNKNOWN'
  
  // Log en consola en desarrollo
  if (logToConsole && import.meta.env.DEV) {
    console.error(`[ERROR ${context ? `- ${context}` : ''}]:`, {
      message: errorMessage,
      code: errorCode,
      error: error
    })
  }
  
  // Aquí se podría integrar con un sistema de notificaciones (toast)
  if (showNotification) {
    // TODO: Integrar con sistema de notificaciones
    // notificationService.error(errorMessage)
  }
  
  // Aquí se podría enviar a un servicio de logging externo
  if (import.meta.env.PROD && errorCode >= 500) {
    // TODO: Enviar a servicio de logging (Sentry, LogRocket, etc.)
    // logService.captureError(error)
  }
  
  return {
    message: errorMessage,
    code: errorCode,
    timestamp: new Date(),
    context
  }
}

/**
 * Wrapper para funciones asíncronas que maneja errores automáticamente
 * @param {Function} fn - Función asíncrona a ejecutar
 * @param {Object} options - Opciones de manejo de errores
 * @returns {Function} Función wrapped
 */
export function withErrorHandling(fn, options = {}) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, options)
      throw error
    }
  }
}

/**
 * Valida una respuesta de API y lanza error si no es exitosa
 * @param {Response} response - Respuesta de fetch
 * @throws {AppError} Si la respuesta no es exitosa
 */
export async function validateApiResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    
    throw new AppError(
      errorData.message || getErrorMessage({ status: response.status }),
      response.status,
      errorData
    )
  }
  
  return response
}

/**
 * Retry logic para funciones que pueden fallar
 * @param {Function} fn - Función a reintentar
 * @param {Object} options - Opciones de retry
 * @returns {Promise} Resultado de la función
 */
export async function retry(fn, options = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options
  
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(backoff, i)
        onRetry(i + 1, waitTime, error)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }
  
  throw lastError
}

/**
 * Debounce para funciones que pueden llamarse múltiples veces
 * @param {Function} fn - Función a hacer debounce
 * @param {number} delay - Delay en ms
 * @returns {Function} Función con debounce
 */
export function debounce(fn, delay = 300) {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * Throttle para funciones que deben limitarse en frecuencia
 * @param {Function} fn - Función a hacer throttle
 * @param {number} limit - Tiempo mínimo entre ejecuciones (ms)
 * @returns {Function} Función con throttle
 */
export function throttle(fn, limit = 300) {
  let inThrottle
  
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
