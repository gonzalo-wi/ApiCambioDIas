import { API_CONFIG } from '@/config/api.config'

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Cliente HTTP centralizado
 * Maneja todas las peticiones HTTP con configuración común
 */
class HttpClient {
  constructor(baseURL = API_CONFIG.BASE_URL, timeout = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS
  }

  /**
   * Método base para hacer peticiones
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Merge de headers
    const headers = {
      ...this.defaultHeaders,
      ...options.headers
    }

    // Configuración de la petición
    const config = {
      ...options,
      headers,
      signal: this._createAbortSignal(options.timeout || this.timeout)
    }

    try {
      const response = await fetch(url, config)
      
      // Manejo de errores HTTP
      if (!response.ok) {
        await this._handleErrorResponse(response)
      }

      // Parse de respuesta
      return await this._parseResponse(response)
      
    } catch (error) {
      // Manejo de errores de red o timeout
      if (error.name === 'AbortError') {
        throw new ApiError('La petición excedió el tiempo límite', 408)
      }
      
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new ApiError(
        error.message || 'Error de conexión con el servidor',
        0,
        error
      )
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, options = {}) {
    const queryString = this._buildQueryString(params)
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request(url, {
      ...options,
      method: 'GET'
    })
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    })
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  /**
   * Helpers privados
   */
  
  _createAbortSignal(timeout) {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)
    return controller.signal
  }

  _buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) return ''
    
    return Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  }

  async _parseResponse(response) {
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text()
  }

  async _handleErrorResponse(response) {
    let errorData = null
    let errorMessage = `Error ${response.status}`

    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } else {
        errorMessage = await response.text()
      }
    } catch (e) {
      // Si no se puede parsear el error, usar mensaje por defecto
      errorMessage = response.statusText || errorMessage
    }

    throw new ApiError(errorMessage, response.status, errorData)
  }
}

/**
 * Instancia singleton del cliente HTTP
 */
export const apiClient = new HttpClient()

/**
 * Crear un cliente con configuración personalizada
 */
export function createHttpClient(baseURL, timeout) {
  return new HttpClient(baseURL, timeout)
}
