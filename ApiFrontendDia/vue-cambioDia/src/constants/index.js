/**
 * Constantes de rutas de la aplicación
 */
export const ROUTES = {
  HOME: '/',
  VENTANA: '/ventanaView',
  
  // Panel routes
  PANEL: {
    ROOT: '/panel',
    DASHBOARD: '/panel/dashboard',
    ADJUNTOS: '/panel/adjuntos',
    SIISA: '/panel/siisa',
    TOKEN: '/panel/token',
    WHATSAPP: '/panel/whatsapp',
    JAULA: '/panel/jaula',
    GESTION_FC: '/panel/gestion-fc',
  }
}

/**
 * Keys para localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_PREFERENCES: 'user_preferences',
  LAST_SEARCH: 'last_search',
  THEME: 'theme',
}

/**
 * Códigos de estado HTTP comunes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  TIMEOUT: 'La petición excedió el tiempo límite. Intenta nuevamente.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  UNKNOWN: 'Ocurrió un error inesperado.',
}

/**
 * Configuración de la jaula (camiones)
 */
export const JAULA_CONFIG = {
  MAX_CAPACITY: 3, // Máximo de dispensers por camión
  WARNING_THRESHOLD: 1, // Mostrar warning si disponibilidad <= 1
}

/**
 * Colores de semáforo SIISA
 */
export const SIISA_COLORS = {
  VERDE: {
    bg: '#d1fae5',
    border: '#10b981',
    text: '#065f46',
  },
  AMARILLO: {
    bg: '#fef3c7',
    border: '#f59e0b',
    text: '#92400e',
  },
  ROJO: {
    bg: '#fee2e2',
    border: '#ef4444',
    text: '#991b1b',
  },
}

/**
 * Estados de situación SIISA (1-6)
 */
export const SIISA_SITUACION_LABELS = {
  1: 'Normal',
  2: 'Riesgo Bajo',
  3: 'Riesgo Medio',
  4: 'Riesgo Alto',
  5: 'Riesgo Crítico',
  6: 'Irrecuperable',
}
