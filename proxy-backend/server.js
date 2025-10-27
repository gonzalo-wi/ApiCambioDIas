import express from 'express'
import cors from 'cors'
import axios from 'axios'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const API_BASE = 'https://api.analytics.va.s1g.in/api/public'
const PUBLIC_KEY = 'ivess.38ef4216339c1a0fbc5937876e6470303e7d2ee7'

app.post('/api/attachments', async (req, res) => {
  try {
    const params = new URLSearchParams()
    params.append('key', PUBLIC_KEY)

    const tokenRes = await axios.post(`${API_BASE}/token/`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    const token = tokenRes.data?.data?.token

    const result = await axios.get(`${API_BASE}/get/`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        type: 'attachments_detail',
        date_from: req.body.date_from,
        date_to: req.body.date_to,
        offset: 0,
        page_size: 100
      }
    })

    const filtered = result.data?.data?.filter(att =>
      att.att_type?.includes('image') || att.att_type?.includes('pdf')
    )

    res.json(filtered)
  } catch (error) {
    // Muestra el error real en la terminal y lo devuelve al frontend
    const proxyError = error?.response?.data || error?.message || error
    console.error('❌ Error en el proxy:', proxyError)
    res.status(500).json({ error: proxyError })
  }
})

// Endpoint para generar token del backend Go
app.get('/api/token', async (req, res) => {
  try {
    const result = await axios.get('http://backend:8080/api/token')
    res.json(result.data)
  } catch (error) {
    const proxyError = error?.response?.data || error?.message || error
    console.error('❌ Error al obtener token:', proxyError)
    res.status(500).json({ error: proxyError })
  }
})

// Endpoint para obtener propuestas
app.get('/api/propuestas/:clienteID', async (req, res) => {
  try {
    const { clienteID } = req.params
    const result = await axios.get(`http://backend:8080/propuestas/${clienteID}`)
    res.json(result.data)
  } catch (error) {
    const proxyError = error?.response?.data || error?.message || error
    console.error('❌ Error al obtener propuestas:', proxyError)
    res.status(500).json({ error: proxyError })
  }
})

// Endpoint para cambiar visita
app.post('/api/cambiar-visita', async (req, res) => {
  try {
    const result = await axios.post('http://backend:8080/cambiar-visita', req.body)
    res.json(result.data)
  } catch (error) {
    const proxyError = error?.response?.data || error?.message || error
    console.error('❌ Error al cambiar visita:', proxyError)
    res.status(500).json({ error: proxyError })
  }
})

app.listen(3001, () => {
  console.log('Proxy server corriendo en http://localhost:3001')
})