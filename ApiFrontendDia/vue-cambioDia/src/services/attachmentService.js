import axios from 'axios'

function normalizarFecha(fecha) {
  // Convierte "YYYY-MM-DDTHH:mm:ss" a "YYYY-MM-DD HH:mm:ss"
  return fecha.replace('T', ' ');
}

export async function fetchAttachment({ date_from, date_to }) {
  try {
    const res = await axios.post('http://localhost:3001/api/attachments', {
      date_from: normalizarFecha(date_from),
      date_to: normalizarFecha(date_to)
    })
    return res.data
  } catch (err) {
    console.error('❌ Error consultando adjuntos desde proxy: ', err)
    return []
  }
}