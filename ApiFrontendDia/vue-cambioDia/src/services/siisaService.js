const API_BASE_URL = 'http://192.168.0.251:8083/api'

export class SiisaService {
  /**
   * Consulta los datos financieros de una persona en SIISA
   * @param {string} documento - Número de documento (DNI)
   * @param {string} sexo - Sexo de la persona (opcional)
   * @returns {Promise} - Respuesta de la API
   */
  static async consultarPersona(documento, sexo = '') {
    try {
      const url = `${API_BASE_URL}/get-data-siisa?documento=${documento}&sexo=${sexo}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en consultarPersona:', error)
      throw new Error(`Error al consultar SIISA: ${error.message}`)
    }
  }

  /**
   * Determina el color del semáforo según la situación financiera
   * @param {Object} semaforo - Objeto semáforo de la respuesta
   * @returns {Object} - Información del semáforo procesada
   */
  static procesarSemaforo(semaforo) {
    const colores = {
      verde: {
        color: '#22c55e',
        bgColor: '#dcfce7',
        borderColor: '#16a34a',
        texto: 'Situación Normal'
      },
      amarillo: {
        color: '#eab308',
        bgColor: '#fefce8',
        borderColor: '#ca8a04',
        texto: 'Situación Condicional'
      },
      rojo: {
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#dc2626',
        texto: 'Situación Crítica'
      }
    }

    return {
      ...semaforo,
      estilos: colores[semaforo.color] || colores.rojo
    }
  }

  /**
   * Formatea el monto en pesos argentinos
   * @param {number} monto - Monto a formatear
   * @returns {string} - Monto formateado
   */
  static formatearMonto(monto) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto)
  }

  /**
   * Calcula la edad basada en la fecha de nacimiento
   * @param {string} fechaNac - Fecha de nacimiento en formato YYYY-MM-DD
   * @returns {number} - Edad calculada
   */
  static calcularEdad(fechaNac) {
    const hoy = new Date()
    const nacimiento = new Date(fechaNac)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth()
    
    if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    
    return edad
  }
}