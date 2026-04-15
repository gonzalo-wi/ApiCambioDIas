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

// Endpoint para verificar disponibilidad de jaula por reparto, fecha y cantidad
app.get('/api/aguas/disponibilidad-jaula-x-reparto-fecha-cantidad', async (req, res) => {
  try {
    const { idReparto, fecha, cantidad } = req.query
    console.log('🚚 Verificando disponibilidad jaula:', { idReparto, fecha, cantidad })
    
    const result = await axios.get(`${EL_JUMILLANO_BASE}/api/aguas/disponibilidad-jaula-x-reparto-fecha-cantidad`, {
      params: { idReparto, fecha, cantidad },
      timeout: 30000
    })
    
    console.log('✅ Verificación de disponibilidad completada:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error verificando disponibilidad jaula:', errorDetails)
    res.status(error.response?.status || 500).json({ 
      error: 'Error al verificar disponibilidad de jaula',
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
    console.log('🎫 Token value:', token ? token.substring(0, 50) + '...' : 'VACIO')
    
    // La API externa requiere Bearer token en Authorization header
    const params = { documento }
    if (sexo) params.sexo = sexo
    
    console.log('📤 Enviando request a:', `${EL_JUMILLANO_BASE}/api/sissa/documento/get-situacion-full`)
    console.log('📤 Params:', params)
    console.log('📤 Authorization header:', token ? `Bearer ${token.substring(0, 50)}...` : 'NO TOKEN')
    
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

// Healthcheck sencillo para verificar que el proxy está corriendo y actualizado
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: 'whatsapp-route-enabled' })
})

// ========== PROXY PARA DISPENSER OPERATIONS (192.168.0.250:8095) ==========
const DISPENSER_OPS_BASE = 'http://192.168.0.250:8095'

// Consultar token de entrega FC por cuenta y fecha
app.get('/api/consultar-token-fc', async (req, res) => {
  try {
    const { fecha_accion, nro_cta } = req.query
    console.log('🔍 Consultando token FC:', { fecha_accion, nro_cta })

    const result = await axios.get(
      `${DISPENSER_OPS_BASE}/dispenser-operations/api/v1/deliveries/contact-center/token`,
      {
        params: { fecha_accion, nro_cta },
        timeout: 10000
      }
    )

    console.log('✅ Token FC encontrado:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error consultando token FC:', errorDetails)
    res.status(error.response?.status || 500).json({
      error: 'Error al consultar token FC',
      details: errorDetails
    })
  }
})

// Generar sesión de términos y condiciones
app.post('/api/contact-center/session', async (req, res) => {
  try {
    const { sessionId } = req.body
    console.log('📋 Generando sesión T&C:', { sessionId })

    const result = await axios.post(
      `${DISPENSER_OPS_BASE}/dispenser-operations/api/v1/contact-center/session`,
      { sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    )

    console.log('✅ Sesión T&C generada:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error generando sesión T&C:', errorDetails)
    res.status(error.response?.status || 500).json({
      error: 'Error al generar sesión de términos y condiciones',
      details: errorDetails
    })
  }
})

// Consultar estado de T&C por sessionId (polling)
app.get('/api/terms/by-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    console.log('🔄 Consultando estado T&C para sesión:', sessionId)

    const result = await axios.get(
      `${DISPENSER_OPS_BASE}/dispenser-operations/api/v1/terms/by-session/${sessionId}`,
      { timeout: 10000 }
    )

    console.log('✅ Estado T&C:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error consultando estado T&C:', errorDetails)
    res.status(error.response?.status || 500).json({
      error: 'Error al consultar estado de términos y condiciones',
      details: errorDetails
    })
  }
})

// Crear entrega contact-center (instalación)
app.post('/api/v1/deliveries/contact-center', async (req, res) => {
  try {
    const url = `${DISPENSER_OPS_BASE}/dispenser-operations/api/v1/deliveries/contact-center`
    console.log('📦 Creando entrega contact-center:', req.body)
    console.log('📦 URL destino:', url)

    const result = await axios.post(
      url,
      req.body,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    )

    console.log('✅ Entrega contact-center creada:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error creando entrega contact-center:', errorDetails)
    res.status(error.response?.status || 500).json({
      error: 'Error al crear entrega de contact center',
      details: errorDetails
    })
  }
})

// ========== PROXY PARA BACKEND DE ENTREGAS (localhost:8080) ==========
const ENTREGAS_BASE_URL = 'http://localhost:8080'

// Crear entrega de dispenser
app.post('/api/entregas', async (req, res) => {
  try {
    console.log('📦 Creando entrega en backend:', req.body)
    
    const result = await axios.post(
      `${ENTREGAS_BASE_URL}/api/v1/deliveries`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )
    
    console.log('✅ Entrega creada:', result.data)
    res.json(result.data)
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error creando entrega:', errorDetails)
    res.status(error.response?.status || 500).json({ 
      error: 'Error al crear entrega',
      details: errorDetails
    })
  }
})

// ========== PROXY PARA INFOBIP (WhatsApp Moments) ==========
const INFOBIP_BASE = process.env.INFOBIP_BASE || 'https://89ydp1.api.infobip.com'
const INFOBIP_FLOW_ID = process.env.INFOBIP_FLOW_ID || '200000035823248'
const INFOBIP_AUTH = process.env.INFOBIP_AUTH || '' // Debe ser el token tipo "App <token>"

// Enviar participantes a un Flow de Moments (WhatsApp)
app.post('/api/whatsapp/participants', async (req, res) => {
  try {
    if (!INFOBIP_AUTH) {
      return res.status(500).json({ error: 'INFOBIP_AUTH no configurado en el servidor proxy' })
    }

    const url = `${INFOBIP_BASE}/moments/1/flows/${INFOBIP_FLOW_ID}/participants`
    console.log('📨 Enviando participantes a Infobip Moments...', {
      url,
      flowId: INFOBIP_FLOW_ID,
      hasAuth: !!INFOBIP_AUTH,
      bodySample: JSON.stringify(req.body)?.substring(0,200)
    })

    // Passthrough del body (soporta múltiples variantes) con normalización
    const payload = req.body
    if (!payload || !Array.isArray(payload.participants)) {
      return res.status(400).json({ error: 'Formato inválido: se espera { participants: [...] }' })
    }
    // Normalizar teléfono: mantener dígitos y versión E.164 (+prefijo)
    const toDigits = (n) => {
      if (!n) return null
      const digits = String(n).trim().replace(/\D/g, '')
      return digits || null
    }

    const normalized = []
    for (const p of payload.participants) {
      let number = p?.contactInformation?.phone?.number
      if (!number) number = p?.channels?.whatsapp?.phoneNumber
      if (!number && p?.phone) number = p.phone
      if (!number && p?.phoneNumber) number = p.phoneNumber
      const digits = toDigits(number)
      if (!digits) {
        return res.status(400).json({ error: 'Falta o es inválido el número de teléfono en uno de los participantes' })
      }
      const e164 = `+${digits}`

      const entry = {
        // identifyBy por compatibilidad como string; también guardamos variantes
        identifyBy: (p?.identifyBy && typeof p.identifyBy === 'string') ? p.identifyBy : 'PHONE_NUMBER',
        contactInformation: {
          phone: { number: e164 },
          phoneNumber: e164
        },
        // Guardar formas auxiliares para armar variantes
        _digits: digits
      }
      if (p?.person?.firstName) {
        entry.person = { firstName: String(p.person.firstName).trim() }
      }
      normalized.push(entry)
    }
    // Construir variantes de payload por compatibilidad con distintos esquemas de Moments
    const variants = [
      // Variante exacta provista por Infobip: identifyBy como objeto { identifier, type: 'PHONE' }
      {
        name: 'IDENTIFY_BY_OBJECT_PHONE',
        body: { participants: normalized.map(p => ({
          identifyBy: { identifier: p._digits, type: 'PHONE' },
          ...(p.person ? { person: p.person } : {})
        })) }
      },
      {
        name: 'PHONE_NUMBER+contactInformation.phoneNumber',
        body: { participants: normalized.map(p => ({
          identifyBy: 'PHONE_NUMBER',
          contactInformation: { phoneNumber: p.contactInformation.phone.number },
          ...(p.person ? { person: p.person } : {})
        })) }
      },
      {
        name: 'PHONE+contactInformation.phone.number',
        body: { participants: normalized.map(p => ({
          identifyBy: 'PHONE',
          contactInformation: { phone: { number: p.contactInformation.phone.number } },
          ...(p.person ? { person: p.person } : {})
        })) }
      },
      {
        name: 'CONTACT_INFORMATION+contactInformation.phoneNumber',
        body: { participants: normalized.map(p => ({
          identifyBy: 'CONTACT_INFORMATION',
          contactInformation: { phoneNumber: p.contactInformation.phone.number },
          ...(p.person ? { person: p.person } : {})
        })) }
      },
      {
        name: 'PHONE_NUMBER+contactInformation.phone.phoneNumber',
        body: { participants: normalized.map(p => ({
          identifyBy: 'PHONE_NUMBER',
          contactInformation: { phone: { phoneNumber: p.contactInformation.phone.number } },
          ...(p.person ? { person: p.person } : {})
        })) }
      },
      {
        name: 'PHONE_NUMBER+contactInformation.phone.number+phoneNumber',
        body: { participants: normalized.map(p => ({
          identifyBy: 'PHONE_NUMBER',
          contactInformation: { phone: { number: p.contactInformation.phone.number }, phoneNumber: p.contactInformation.phone.number },
          ...(p.person ? { person: p.person } : {})
        })) }
      }
    ]

    const forceSchema = req.query?.schema
    const list = forceSchema ? variants.filter(v => v.name === forceSchema) : variants
    if (forceSchema && list.length === 0) {
      console.warn('⚠️ Esquema solicitado no reconocido:', forceSchema)
    }

    let lastError = null
    for (const v of list) {
      try {
        console.log(`📤 Intentando esquema Moments: ${v.name}`)
        const result = await axios.post(url, v.body, {
          headers: {
            'Authorization': `App ${INFOBIP_AUTH.replace(/^App\s+/i, '')}`,
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
          },
          timeout: 20000
        })
        console.log(`✅ Envío OK con esquema: ${v.name}`)
        return res.status(result.status || 200).json(result.data)
      } catch (err) {
        lastError = err
        const detailMsg = err?.response?.data?.detail || err?.response?.data?.message || err?.message
        const status = err?.response?.status
        console.warn(`⚠️ Falló esquema ${v.name} -> status=${status} detail=${detailMsg}`)
        // Si es 400 (Bad Request) seguimos probando próximos esquemas; si es otro error, detenemos
        if (status && status !== 400) break
      }
    }

    // Si llegamos acá, no funcionó ningún esquema
    const forwardMsg = lastError?.response?.data?.message || lastError?.response?.data?.detail || 'Error al enviar participantes a Infobip Moments'
    const status = lastError?.response?.status || 500
    console.error('❌ Todos los esquemas fallaron', {
      status,
      data: lastError?.response?.data
    })
    return res.status(status).json({ error: forwardMsg, details: lastError?.response?.data || lastError?.message })
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    }
    console.error('❌ Error al enviar participantes a Infobip:', errorDetails)
    // Forward del mensaje específico si Infobip describe el problema
    const forwardMsg = error.response?.data?.message || error.response?.data?.error || 'Error al enviar participantes a Infobip Moments'
    res.status(error.response?.status || 500).json({
      error: forwardMsg,
      details: errorDetails
    })
  }
})

app.listen(3001, () => {
  console.log('Proxy server corriendo en http://localhost:3001')
})