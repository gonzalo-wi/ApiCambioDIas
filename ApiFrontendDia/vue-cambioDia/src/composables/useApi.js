import { ref, unref } from 'vue'

/**
 * Composable para manejar peticiones API de forma reactiva
 * Incluye estados de loading, error y data
 * 
 * @example
 * const { data, loading, error, execute } = useApi(jaulaService.consultarDisponibilidad)
 * await execute(idReparto)
 */
export function useApi(apiFunction) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Ejecuta la función API con los argumentos proporcionados
   */
  const execute = async (...args) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiFunction(...unref(args))
      data.value = response
      return response
    } catch (err) {
      error.value = err.message || 'Error desconocido'
      console.error('API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Resetea todos los estados
   */
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  /**
   * Limpia solo el error
   */
  const clearError = () => {
    error.value = null
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
    clearError
  }
}

/**
 * Composable para peticiones con auto-ejecución
 * Se ejecuta automáticamente al montar el componente
 * 
 * @example
 * const { data, loading, error, refresh } = useApiAuto(
 *   () => jaulaService.consultarDisponibilidad(idReparto.value),
 *   { immediate: true }
 * )
 */
export function useApiAuto(apiFunction, options = {}) {
  const {
    immediate = true,
    resetOnExecute = false
  } = options

  const { data, loading, error, execute, reset, clearError } = useApi(apiFunction)

  /**
   * Función de refresh/reload
   */
  const refresh = async () => {
    if (resetOnExecute) {
      reset()
    }
    return execute()
  }

  // Auto-ejecutar si immediate es true
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    refresh,
    reset,
    clearError
  }
}
