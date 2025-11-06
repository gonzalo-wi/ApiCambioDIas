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
    console.log('📝 Solicitando token para attachments...')
    const params = new URLSearchParams()
    params.append('key', PUBLIC_KEY)

    const tokenRes = await axios.post(`${API_BASE}/token/`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000
    })

    const token = tokenRes.data?.data?.token
    console.log('✅ Token obtenido:', token ? 'OK' : 'FAIL')

    console.log('📊 Consultando attachments...', {
      date_from: req.body.date_from,
      date_to: req.body.date_to
    })

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
      },
      timeout: 15000
    })

    const filtered = result.data?.data?.filter(att =>
      att.att_type?.includes('image') || att.att_type?.includes('pdf')
    )

    console.log('✅ Attachments filtrados:', filtered?.length || 0)
    res.json(filtered)
  } catch (error) {
    // Muestra el error real en la terminal y lo devuelve al frontend
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error en el proxy:', errorDetails)
    res.status(500).json({ 
      error: 'Error al consultar attachments',
      details: errorDetails
    })
  }
})

// Endpoint para generar token del backend Spring Boot
app.get('/api/token', async (req, res) => {
  try {
    console.log('🔑 Solicitando token del backend Spring Boot...')
    const result = await axios.get('http://localhost:8081/api/token', {
      timeout: 5000
    })
    console.log('✅ Token generado:', result.data)
    res.json(result.data)
  } catch (error) {
    const proxyError = error?.response?.data || error?.message || error
    console.error('❌ Error al obtener token:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    })
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

// ========== PROXY PARA APIs EXTERNAS (El Jumillano) ==========
const EL_JUMILLANO_BASE = 'http://ho.el-jumillano.com.ar:24937'
const SIISA_API_KEY = 'JUMI_8vQ2rKx9ZcLfR1aE5pTgH0wVbNdUsYi3oJ7qSXzMpA4B'

// Endpoint para disponibilidad de jaula
app.get('/api/aguas/disponibilidad-jaula', async (req, res) => {
  try {
    const { idReparto } = req.query
    console.log('🚚 Consultando disponibilidad jaula para reparto:', idReparto)
    
    const result = await axios.get(`${EL_JUMILLANO_BASE}/api/aguas/disponibilidad-jaula`, {
      params: { idReparto },
      timeout: 30000
    })
    
    console.log('✅ Disponibilidad jaula obtenida')
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error en disponibilidad jaula:', errorDetails)
    res.status(error.response?.status || 500).json({ 
      error: 'Error al consultar disponibilidad de jaula',
      details: errorDetails
    })
  }
})

// Endpoint para obtener token SIISA
app.get('/api/token/get-token', async (req, res) => {
  try {
    console.log('🔑 Solicitando token SIISA...')
    
    const result = await axios.get(`${EL_JUMILLANO_BASE}/api/token/get-token`, {
      headers: {
        'x-api-key': SIISA_API_KEY
      },
      timeout: 10000
    })
    
    console.log('✅ Token SIISA obtenido:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error al obtener token SIISA:', errorDetails)
    res.status(error.response?.status || 500).json({ 
      error: 'Error al obtener token SIISA',
      details: errorDetails
    })
  }
})

// Endpoint para consultar situación full en SIISA (GET)
app.get('/api/sissa/documento/get-situacion-full', async (req, res) => {
  try {
    const { documento, sexo, token } = req.query
    console.log('🏥 Consultando SIISA para documento:', documento)
    console.log('🔑 Token recibido:', token ? 'SI' : 'NO')
    
    // La API externa requiere Bearer token en Authorization header
    const params = { documento }
    if (sexo) params.sexo = sexo
    
    const result = await axios.get(
      `${EL_JUMILLANO_BASE}/api/sissa/documento/get-situacion-full`,
      {
        params,
        headers: {
          'x-api-key': SIISA_API_KEY,
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      }
    )
    
    console.log('✅ Datos SIISA obtenidos')
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error en consulta SIISA:', errorDetails)
    res.status(error.response?.status || 500).json({ 
      error: 'Error al consultar SIISA',
      details: errorDetails
    })
  }
})

app.listen(3001, () => {
  console.log('Proxy server corriendo en http://localhost:3001')
})