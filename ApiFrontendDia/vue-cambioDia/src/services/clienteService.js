import axios from 'axios'

const BASE_URL_JMAP = 'https://servicios.el-jumillano.com.ar:8443'
const BEARER_TOKEN_JMAP = 'd2F2eTpDMkRBRkNBQ0U2Rjg5REVBMjE0N0NFRDlDODNDMTJGMQ=='

let cachedToken = null
let tokenExpiry = null

/**
 * Obtiene el token de autenticación
 * Cachea el token durante 23 horas para evitar solicitudes innecesarias
 */
async function getToken() {
  // Si tenemos un token cacheado y no ha expirado, lo usamos
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('📌 Usando token cacheado')
    return cachedToken
  }

  try {
    console.log('🔑 Solicitando nuevo token JMAP...')
    const response = await axios.get(`${BASE_URL_JMAP}/jmap2token/token`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN_JMAP}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📦 Respuesta token:', response.data)
    
    // Intentar extraer el token de diferentes formas
    let token = ''
    if (typeof response.data === 'string') {
      token = response.data
    } else if (response.data.token) {
      token = response.data.token
    } else if (response.data.data) {
      token = response.data.data
    } else {
      throw new Error('Formato de respuesta de token no reconocido')
    }
    
    // Si el token ya incluye "Bearer ", quitarlo para guardarlo limpio
    if (token.startsWith('Bearer ')) {
      token = token.substring(7)
    }
    
    cachedToken = token
    console.log('✅ Token obtenido:', cachedToken.substring(0, 30) + '...')
    
    // Cachear por 23 horas (el token dura 1 día)
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000

    return cachedToken
  } catch (error) {
    console.error('❌ Error obteniendo token JMAP:', error)
    throw new Error('No se pudo obtener el token de autenticación')
  }
}

/**
 * Consulta un cliente por DNI
 * @param {string|number} dni - Número de DNI del cliente
 * @returns {Promise<Object>} Datos del cliente filtrados
 */
export async function consultarClientePorDNI(dni, retry = true) {
  try {
    // Obtener token
    const token = await getToken()
    console.log('🔍 Consultando cliente DNI:', dni)

    // Consultar cliente
    const response = await axios.get(`${BASE_URL_JMAP}/jmap2/client`, {
      params: { dni },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 Respuesta cliente:', response.data)

    // Validar respuesta
    if (!response.data.success || !response.data.data || response.data.data.length === 0) {
      throw new Error('No se encontró cliente con ese DNI')
    }

    return response.data.data.map(c => ({
      codCliente: c.codCliente,
      nombre: c.nombre,
      direccion: c.direccion,
      localidad: c.localidad,
      idReparto: c.idReparto,
      nombreDiaVisita: c.nombreDiaVisita,
      fechaProxVisita: c.fechaProxVisita
    }))
  } catch (error) {
    console.error('❌ Error consultando cliente:', error)
    
    // Si es error 401 y es el primer intento, invalidar token y reintentar
    if (error.response?.status === 401 && retry) {
      console.log('⚠️ Token inválido, obteniendo uno nuevo...')
      invalidarToken()
      return consultarClientePorDNI(dni, false) // Reintentar sin más retries
    }
    
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token de autenticación inválido')
      } else if (status === 404) {
        throw new Error('No se encontró cliente con ese DNI')
      } else {
        throw new Error(`Error del servidor: ${status}`)
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor')
    } else {
      throw error
    }
  }
}

/**
 * Invalida el token cacheado (útil si hay error 401)
 */
export function invalidarToken() {
  cachedToken = null
  tokenExpiry = null
}

export default {
  consultarClientePorDNI,
  invalidarToken
}
