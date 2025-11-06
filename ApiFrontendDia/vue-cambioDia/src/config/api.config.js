/**
 * Configuración centralizada de API
 * Usa variables de entorno para diferentes ambientes
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
  TIMEOUT: 15000, // 15 segundos
  
  // Endpoints
  ENDPOINTS: {
    // Attachments S1
    ATTACHMENTS: '/api/attachments',
    
    // Token generation
    TOKEN: '/api/token',
    
    // Jaula - disponibilidad de camiones
    JAULA_DISPONIBILIDAD: '/api/aguas/disponibilidad-jaula',
    
    // SIISA - Central de deudores
    SIISA_TOKEN: '/api/token/get-token',
    SIISA_CONSULTA: '/api/sissa/documento/get-situacion-full',
    
    // Cambio de día (Ventana)
    PROPUESTAS: '/api/propuestas',
    CAMBIAR_VISITA: '/api/cambiar-visita',
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // API Keys (deberían venir de variables de entorno en producción)
  API_KEYS: {
    SIISA: import.meta.env.VITE_SIISA_API_KEY || 'JUMI_8vQ2rKx9ZcLfR1aE5pTgH0wVbNdUsYi3oJ7qSXzMpA4B',
  }
}

/**
 * URLs externas (fuera del proxy)
 */
export const EXTERNAL_APIS = {
  EL_JUMILLANO: 'http://ho.el-jumillano.com.ar:24937/api',
}
