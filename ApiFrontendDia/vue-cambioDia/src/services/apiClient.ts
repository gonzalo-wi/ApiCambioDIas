import axios from 'axios'

// Declaración mínima para evitar error de tipos si no existe d.ts global
// Tipado laxo porque el proyecto no tiene las definiciones Vite incluidas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env: any = (import.meta as any).env || {}
// Base URL configurable por variable de entorno Vite
export const baseURL: string = env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL,
  timeout: 15000,
})

api.interceptors.response.use(
  r => r,
  err => {
    // Adjuntar un mensaje amigable si no existe
    if (!err.response) {
      err.userMessage = 'No hay respuesta del servidor. Verifique conexión.'
    } else if (err.response.status >= 500) {
      err.userMessage = 'Error interno del servidor (500).'
    }
    return Promise.reject(err)
  }
)

export default api
