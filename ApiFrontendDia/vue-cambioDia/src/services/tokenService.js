import { apiClient } from './api.client'
import { API_CONFIG } from '../config/api.config'

/**
 * Servicio para gestión de tokens de dispensador
 */
export class TokenService {
  /**
   * Genera un nuevo token de 6 dígitos
   * @returns {Promise<{token: string}>} Token generado
   */
  static async getToken() {
    return apiClient.get(API_CONFIG.ENDPOINTS.TOKEN)
  }
}
