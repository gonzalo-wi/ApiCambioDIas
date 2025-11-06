/**
 * Formatea un número como moneda argentina (ARS)
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$0,00'
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date + 'T00:00:00')
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Formatea fecha con nombre de día
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Ej: "Lun 15/11"
 */
export function formatDateShort(date) {
  if (!date) return ''
  
  const d = new Date(date + 'T00:00:00')
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const day = d.getDate()
  const month = d.getMonth() + 1
  
  return `${dias[d.getDay()]} ${day}/${month}`
}

/**
 * Formatea fecha completa
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Ej: "15 de Noviembre de 2025"
 */
export function formatDateFull(date) {
  if (!date) return ''
  
  const d = new Date(date + 'T00:00:00')
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}

/**
 * Formatea un CUIL en formato XX-XXXXXXXX-X
 * @param {string|number} cuil - CUIL a formatear
 * @returns {string} CUIL formateado
 */
export function formatCUIL(cuil) {
  if (!cuil) return ''
  
  const cuilStr = String(cuil)
  if (cuilStr.length !== 11) return cuilStr
  
  return `${cuilStr.slice(0, 2)}-${cuilStr.slice(2, 10)}-${cuilStr.slice(10)}`
}

/**
 * Formatea un DNI agregando puntos de miles
 * @param {string|number} dni - DNI a formatear
 * @returns {string} DNI formateado
 */
export function formatDNI(dni) {
  if (!dni) return ''
  
  return String(dni).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Formatea un token en formato XXX-XXX
 * @param {string|number} token - Token a formatear
 * @returns {string} Token formateado
 */
export function formatToken(token) {
  if (!token) return ''
  
  const tokenStr = String(token).replace(/[^0-9]/g, '')
  if (tokenStr.length >= 6) {
    return `${tokenStr.slice(0, 3)}-${tokenStr.slice(3, 6)}`
  }
  return tokenStr
}

/**
 * Calcula edad a partir de fecha de nacimiento
 * @param {string|Date} fechaNac - Fecha de nacimiento
 * @returns {number} Edad en años
 */
export function calculateAge(fechaNac) {
  if (!fechaNac) return null
  
  const today = new Date()
  const birthDate = new Date(fechaNac)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (default: '...')
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 50, suffix = '...') {
  if (!text || text.length <= maxLength) return text
  
  return text.substring(0, maxLength).trim() + suffix
}
