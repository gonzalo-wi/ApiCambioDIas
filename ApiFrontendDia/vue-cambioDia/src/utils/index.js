// Exporta todas las utilidades desde un punto central
export * from './formatters'
export * from './validators'
export * from './errorHandler'

/**
 * Utilidades generales de ayuda
 */

/**
 * Genera un ID único simple
 * @returns {string} ID único
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Hace una copia profunda de un objeto
 * @param {any} obj - Objeto a copiar
 * @returns {any} Copia del objeto
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  
  const clonedObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  
  return clonedObj
}

/**
 * Compara dos objetos de forma profunda
 * @param {any} obj1 - Primer objeto
 * @param {any} obj2 - Segundo objeto
 * @returns {boolean} true si son iguales
 */
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true
  
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  
  return true
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del tiempo
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Agrupa un array por una propiedad
 * @param {Array} array - Array a agrupar
 * @param {string|Function} key - Propiedad o función para agrupar
 * @returns {Object} Objeto con grupos
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

/**
 * Ordena un array por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la que ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Filtra valores falsy de un objeto
 * @param {Object} obj - Objeto a limpiar
 * @returns {Object} Objeto sin valores falsy
 */
export function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined && value !== '')
  )
}

/**
 * Convierte un objeto a query string
 * @param {Object} params - Parámetros
 * @returns {string} Query string
 */
export function toQueryString(params) {
  const cleaned = cleanObject(params)
  return new URLSearchParams(cleaned).toString()
}

/**
 * Parsea un query string a objeto
 * @param {string} queryString - Query string
 * @returns {Object} Objeto con parámetros
 */
export function fromQueryString(queryString) {
  const params = new URLSearchParams(queryString)
  return Object.fromEntries(params)
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convierte un string a kebab-case
 * @param {string} str - String a convertir
 * @returns {string} String en kebab-case
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convierte un string a camelCase
 * @param {string} str - String a convertir
 * @returns {string} String en camelCase
 */
export function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}

/**
 * Descarga un blob como archivo
 * @param {Blob} blob - Blob a descargar
 * @param {string} filename - Nombre del archivo
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} true si se copió exitosamente
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * Obtiene un valor anidado de un objeto usando path
 * @param {Object} obj - Objeto
 * @param {string} path - Path en formato 'a.b.c'
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} Valor encontrado o defaultValue
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result == null) return defaultValue
    result = result[key]
  }
  
  return result !== undefined ? result : defaultValue
}

/**
 * Establece un valor anidado en un objeto usando path
 * @param {Object} obj - Objeto
 * @param {string} path - Path en formato 'a.b.c'
 * @param {any} value - Valor a establecer
 */
export function setNestedValue(obj, path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  let current = obj
  
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[lastKey] = value
}
