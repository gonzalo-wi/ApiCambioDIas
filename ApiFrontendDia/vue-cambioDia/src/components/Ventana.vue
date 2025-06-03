<template>
  <div class="ventana">
    <h2 class="titulo">Cambio de Día - Cliente</h2>
    <div class="input-group">
      <input v-model="numeroCliente" type="text" placeholder="Nro de cliente" class="input" />
      <button @click="consultarPropuestas" class="btn btn-buscar">
        Buscar fechas
      </button>
    </div>
    <div v-if="cargando" class="loader"></div>

    <div v-if="propuestas.length" class="fechas-list">
      <label v-for="(propuesta, index) in propuestas" :key="propuesta.nroPropuesta" class="fecha-label">
        <input
          type="radio"
          :value="propuesta"
          v-model="seleccionada"
          class="radio"
        />
        <div>
          <strong>Rerparto:</strong> {{ propuesta.ruta }}<br>
          <strong>Día:</strong> {{ diaNombre(propuesta.diaReparto) }}<br>
          <strong>Horario:</strong> {{ propuesta.horarioVisita }}<br>
          <strong>Dirección cercana:</strong> {{ propuesta.direccion }}
        </div>
      </label>

      <button @click="confirmarSeleccion" class="btn btn-confirmar" :disabled="cargando">
  Confirmar
</button>

    </div>

    <div v-if="mensaje" class="mensaje">
      {{ mensaje }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const numeroCliente = ref('')
const propuestas = ref<any[]>([])
const seleccionada = ref<any | null>(null)
const mensaje = ref('')
const cargando = ref(false)

// Función para traducir letra a nombre de día
function diaNombre(letra: string) {
  const dias: Record<string, string> = {
    A: 'Lunes',
    B: 'Martes',
    C: 'Miércoles',
    D: 'Jueves',
    E: 'Viernes',
    F: 'Sábado'
  }
  return dias[letra] || letra
}

const consultarPropuestas = async () => {
  if (!numeroCliente.value) {
    mensaje.value = 'Por favor ingresa un número de cliente.'
    return
  }
  cargando.value = true
  try {
    const res = await axios.get(`http://localhost:8080/propuestas/${numeroCliente.value}`)
    propuestas.value = res.data
    seleccionada.value = null
    mensaje.value = ''
  } catch (err) {
    console.error(err)
    mensaje.value = 'No se pudieron obtener las propuestas.'
  } finally {
    cargando.value = false
  }
}

const confirmarSeleccion = async () => {
  if (!seleccionada.value) {
    mensaje.value = 'Selecciona una propuesta antes de confirmar.'
    return
  }
  cargando.value = true
  try {
    const payload = {
      nroCta: Number(numeroCliente.value),
      cdRuta: seleccionada.value.ruta + seleccionada.value.diaReparto,
      orden: seleccionada.value.ordenRuta,
    }
    await axios.post('http://localhost:8080/cambiar-visita', payload)
    mensaje.value = 'Selección enviada correctamente.'
    numeroCliente.value = ''
    propuestas.value = []
    seleccionada.value = null
  } catch (err) {
    console.error(err)
    mensaje.value = 'Error al confirmar la selección.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.ventana {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 310px;
  background: #f9fafb;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 36px 32px 28px 32px;
  z-index: 9999;
  border: 1px solid #e5e7eb;
  animation: floatIn 0.5s;
  max-width: 95vw;
  max-height: 95vh;
  overflow: auto;
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(-30px);}
  to { opacity: 1; transform: translateY(0);}
}

.titulo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 18px;
  text-align: center;
  letter-spacing: 0.5px;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.input:focus {
  border-color: #2563eb;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  font-weight: 600;
}

.btn-buscar {
  background: #2563eb;
  color: #fff;
}

.btn-buscar:hover {
  background: #1e40af;
}

.fechas-list {
  margin: 18px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fecha-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  background: #e0e7ff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.fecha-label:hover {
  background: #c7d2fe;
}

.radio {
  accent-color: #2563eb;
}

.btn-confirmar {
  background: #22c55e;
  color: #fff;
  margin-top: 12px;
}

.btn-confirmar:hover {
  background: #16a34a;
}

.mensaje {
  margin-top: 16px;
  font-size: 1rem;
  color: #2563eb;
  text-align: center;
  background: #e0f2fe;
  border-radius: 6px;
  padding: 8px;
}
.loader {
  border: 4px solid #e0e7ff;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin: 16px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>