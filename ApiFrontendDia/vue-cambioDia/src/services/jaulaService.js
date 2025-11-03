import axios from 'axios'

const API_BASE = 'http://ho.el-jumillano.com.ar:24937/api/aguas'

export async function consultarDisponibilidadJaula(idReparto) {
  try {
    const res = await axios.get(`${API_BASE}/disponibilidad-jaula`, {
      params: { idReparto }
    })
    return res.data
  } catch (err) {
    console.error('❌ Error consultando disponibilidad jaula:', err)
    throw err
  }
}
