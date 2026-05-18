import { apiClient } from './api.client'
import { API_CONFIG } from '@/config/api.config'

const EP = API_CONFIG.ENDPOINTS

export async function listarEntregas(params = {}) {
  return apiClient.get(EP.DELIVERIES, params)
}

export async function obtenerEntrega(id) {
  return apiClient.get(`${EP.DELIVERIES}/${id}`)
}

export async function crearEntrega(body) {
  return apiClient.post(EP.DELIVERIES, body)
}

export async function actualizarEntrega(id, body) {
  return apiClient.put(`${EP.DELIVERIES}/${id}`, body)
}

export async function eliminarEntrega(id) {
  return apiClient.delete(`${EP.DELIVERIES}/${id}`)
}

export async function cancelarEntrega(id) {
  return apiClient.patch(`/api/v1/deliveries/${id}/cancel`)
}

export async function buscarPorRto(params = {}) {
  return apiClient.get(EP.DELIVERIES_BY_RTO, params)
}

export async function buscarPorCta(params = {}) {
  return apiClient.get(EP.DELIVERIES_BY_CTA, params)
}

export async function pendientesPorCta(nro_cta) {
  return apiClient.get(EP.DELIVERIES_INFOBIP_PENDING, { nro_cta })
}

export default {
  listarEntregas,
  obtenerEntrega,
  crearEntrega,
  actualizarEntrega,
  eliminarEntrega,
  cancelarEntrega,
  buscarPorRto,
  buscarPorCta,
  pendientesPorCta,
}
