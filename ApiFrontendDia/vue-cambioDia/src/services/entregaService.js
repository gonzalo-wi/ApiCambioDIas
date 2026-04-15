import { apiClient } from './api.client'

/**
 * Crea una nueva entrega de dispenser
 * @param {Object} datos - Datos de la entrega
 * @param {string} datos.nro_cta - Número de cuenta (codCliente)
 * @param {string} datos.nro_rto - Número de reparto
 * @param {string} datos.fecha_accion - Fecha de entrega (YYYY-MM-DD)
 * @param {number} datos.cantidad - Cantidad de dispensers
 * @returns {Promise<Object>} Datos de la entrega creada con el token
 */
export async function crearEntrega({ nro_cta, nro_rto, fecha_accion, cantidad }) {
  try {
    console.log('📦 Creando entrega:', { nro_cta, nro_rto, fecha_accion, cantidad })
    
    const data = await apiClient.post('/api/entregas', {
      nro_cta,
      nro_rto,
      estado: 'Pendiente',
      tipo_entrega: 'Instalacion',
      fecha_accion,
      dispensers: [],
      cantidad
    })

    console.log('✅ Entrega creada:', data)
    return data
  } catch (error) {
    console.error('❌ Error creando entrega:', error)
    
    if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status}`)
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor de entregas')
    } else {
      throw error
    }
  }
}

export default {
  crearEntrega
}
