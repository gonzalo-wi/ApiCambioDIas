/**
 * Valida que un email tenga formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export function isValidEmail(email) {
  if (!email) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida un CUIL argentino (formato y dígito verificador)
 * @param {string|number} cuil - CUIL a validar
 * @returns {boolean} true si es válido
 */
export function isValidCUIL(cuil) {
  if (!cuil) return false
  
  const cuilStr = String(cuil).replace(/[^0-9]/g, '')
  if (cuilStr.length !== 11) return false
  
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  let suma = 0
  
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuilStr[i]) * multiplicadores[i]
  }
  
  const verificador = (11 - (suma % 11)) % 11
  return verificador === parseInt(cuilStr[10])
}

/**
 * Valida un DNI argentino
 * @param {string|number} dni - DNI a validar
 * @returns {boolean} true si es válido
 */
export function isValidDNI(dni) {
  if (!dni) return false
  
  const dniStr = String(dni).replace(/\D/g, '')
  const dniNum = parseInt(dniStr)
  
  return dniStr.length >= 7 && dniStr.length <= 8 && dniNum > 0
}

/**
 * Valida que un número de teléfono argentino sea válido
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} true si es válido
 */
export function isValidPhone(phone) {
  if (!phone) return false
  
  const phoneStr = String(phone).replace(/\D/g, '')
  return phoneStr.length >= 10 && phoneStr.length <= 13
}

/**
 * Valida que una fecha sea válida y no futura
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} true si es válida
 */
export function isValidDate(date) {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  
  return d instanceof Date && !isNaN(d) && d <= today
}

/**
 * Valida que un texto no esté vacío
 * @param {string} text - Texto a validar
 * @param {number} minLength - Longitud mínima (default: 1)
 * @returns {boolean} true si no está vacío
 */
export function isNotEmpty(text, minLength = 1) {
  if (!text) return false
  
  return String(text).trim().length >= minLength
}

/**
 * Valida que un número esté en un rango
 * @param {number} num - Número a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en rango
 */
export function isInRange(num, min, max) {
  const n = Number(num)
  return !isNaN(n) && n >= min && n <= max
}

/**
 * Valida que un token sea de 6 dígitos
 * @param {string|number} token - Token a validar
 * @returns {boolean} true si es válido
 */
export function isValidToken(token) {
  if (!token) return false
  
  const tokenStr = String(token).replace(/\D/g, '')
  return tokenStr.length === 6
}

/**
 * Validador genérico de formularios
 * @param {Object} formData - Datos del formulario
 * @param {Object} rules - Reglas de validación
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateForm(formData, rules) {
  const errors = {}
  let isValid = true
  
  for (const [field, validators] of Object.entries(rules)) {
    const value = formData[field]
    const fieldErrors = []
    
    for (const validator of validators) {
      const result = validator.validate(value)
      if (!result) {
        fieldErrors.push(validator.message || `El campo ${field} no es válido`)
        isValid = false
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }
  
  return { isValid, errors }
}

/**
 * Validadores predefinidos para uso con validateForm
 */
export const validators = {
  required: (message = 'Este campo es requerido') => ({
    validate: (value) => isNotEmpty(value),
    message
  }),
  
  email: (message = 'Email inválido') => ({
    validate: (value) => !value || isValidEmail(value),
    message
  }),
  
  cuil: (message = 'CUIL inválido') => ({
    validate: (value) => !value || isValidCUIL(value),
    message
  }),
  
  dni: (message = 'DNI inválido') => ({
    validate: (value) => !value || isValidDNI(value),
    message
  }),
  
  phone: (message = 'Teléfono inválido') => ({
    validate: (value) => !value || isValidPhone(value),
    message
  }),
  
  minLength: (min, message) => ({
    validate: (value) => !value || String(value).length >= min,
    message: message || `Mínimo ${min} caracteres`
  }),
  
  maxLength: (max, message) => ({
    validate: (value) => !value || String(value).length <= max,
    message: message || `Máximo ${max} caracteres`
  }),
  
  range: (min, max, message) => ({
    validate: (value) => !value || isInRange(value, min, max),
    message: message || `Debe estar entre ${min} y ${max}`
  })
}
