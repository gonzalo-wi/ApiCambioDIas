<template>
  <div class="ev">

    <!-- ══ HEADER ══════════════════════════════════════════════════════ -->
    <header class="hdr">
      <div class="hdr-inner">
        <div class="hdr-left">
          <nav class="breadcrumb">
            <span>Dispensers</span>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
            <span class="bc-active">Entregas</span>
          </nav>
          <div class="hdr-title-row">
            <div class="hdr-icon">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 80q17 0 28.5-11.5T760-320q0-17-11.5-28.5T720-360q-17 0-28.5 11.5T680-320q0 17 11.5 28.5T720-280Zm-40-200h170l-90-120h-80v120ZM360-540Z"/></svg>
            </div>
            <div>
              <h1>Gestión de Entregas</h1>
              <p>Listado, creación y edición de entregas de dispensers</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="body">

      <!-- ══ KPI STRIP ═══════════════════════════════════════════════ -->
      <transition name="fade">
        <div v-if="pagination.total > 0" class="kpi-strip">
          <div class="kpi-card">
            <div class="kpi-ico kpi-blue">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 80q17 0 28.5-11.5T760-320q0-17-11.5-28.5T720-360q-17 0-28.5 11.5T680-320q0 17 11.5 28.5T720-280Zm-40-200h170l-90-120h-80v120ZM360-540Z"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Total entregas</span>
              <span class="kpi-val">{{ pagination.total }}</span>
            </div>
          </div>
          <div class="kpi-sep"></div>
          <div class="kpi-card">
            <div class="kpi-ico kpi-amber">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Pendientes</span>
              <span class="kpi-val kv-amber">{{ pendientesCnt }}</span>
            </div>
          </div>
          <div class="kpi-sep"></div>
          <div class="kpi-card">
            <div class="kpi-ico kpi-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Completados</span>
              <span class="kpi-val kv-green">{{ completadosCnt }}</span>
            </div>
          </div>
        </div>
      </transition>

      <!-- ══ FILTROS ══════════════════════════════════════════════════ -->
      <div class="filter-card">
        <div class="filter-grid">
          <div class="fg">
            <label>Estado</label>
            <select v-model="filtros.estado" @change="buscar">
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div class="fg">
            <label>Nro. Cuenta</label>
            <input v-model="filtros.nro_cta" type="text" placeholder="Ej: 12345" @keyup.enter="buscar" />
          </div>
          <div class="fg">
            <label>Fecha acción</label>
            <input v-model="filtros.fecha_accion" type="date" @change="buscar" />
          </div>
          <div class="fg fg-actions">
            <button class="btn-buscar" @click="buscar" :disabled="cargando">
              <svg v-if="!cargando" viewBox="0 -960 960 960" fill="currentColor" width="15" height="15"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
              <svg v-else class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="15" height="15"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/></svg>
              Buscar
            </button>
            <button class="btn-limpiar" @click="limpiarFiltros">Limpiar</button>
          </div>
        </div>
      </div>

      <!-- ══ ERROR ════════════════════════════════════════════════════ -->
      <transition name="fade">
        <div v-if="error" class="error-banner">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          {{ error }}
        </div>
      </transition>

      <!-- ══ TABLA ═════════════════════════════════════════════════════ -->
      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cuenta</th>
              <th>RTO</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="9" class="td-center td-loading">
                <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/></svg>
                Cargando entregas...
              </td>
            </tr>
            <tr v-else-if="!entregas.length">
              <td colspan="9" class="td-center td-empty">Sin resultados para los filtros seleccionados.</td>
            </tr>
            <tr v-for="e in entregas" :key="e.id" class="tr-data">
              <td class="td-id">#{{ e.id }}</td>
              <td>{{ e.nro_cta }}</td>
              <td>{{ e.nro_rto || '—' }}</td>
              <td>{{ e.name || '—' }}</td>
              <td>
                <span class="badge" :class="badgeTipo(e.tipo_entrega)">{{ e.tipo_entrega }}</span>
              </td>
              <td class="td-center">{{ e.cantidad }}</td>
              <td>
                <span class="badge" :class="badgeEstado(e.estado)">{{ e.estado }}</span>
              </td>
              <td>{{ formatFecha(e.fecha_accion) }}</td>
              <td class="td-actions">
                <button class="btn-icon" title="Editar" @click="abrirModalEditar(e)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
                <button v-if="e.estado !== 'Cancelado'" class="btn-icon btn-cancel-action" title="Cancelar" @click="confirmarCancelar(e)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636L5.636 18.364M18.364 18.364L5.636 5.636"/></svg>
                </button>
                <button class="btn-icon btn-delete" title="Eliminar" @click="confirmarEliminar(e)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ══ PAGINACIÓN ═══════════════════════════════════════════════ -->
      <div v-if="pagination.total_pages > 1" class="pagination">
        <button :disabled="pagination.page <= 1" @click="irPagina(pagination.page - 1)">‹ Ant.</button>
        <span>Página {{ pagination.page }} de {{ pagination.total_pages }}</span>
        <button :disabled="pagination.page >= pagination.total_pages" @click="irPagina(pagination.page + 1)">Sig. ›</button>
      </div>

    </main>

    <!-- ══ MODAL CREAR / EDITAR ════════════════════════════════════════ -->
    <transition name="modal-fade">
      <div v-if="modalVisible" class="modal-overlay" @mousedown.self="cerrarModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ modoEdicion ? 'Editar Entrega #' + formData.id : 'Nueva Entrega' }}</h2>
            <button class="modal-close" @click="cerrarModal">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardar" class="mform">

              <div class="mform-row">
                <div class="mfg">
                  <label>Nro. Cuenta *</label>
                  <input v-model="formData.nro_cta" type="text" placeholder="Ej: 12345" required />
                </div>
                <div class="mfg">
                  <label>Nro. RTO *</label>
                  <input v-model="formData.nro_rto" type="text" placeholder="Ej: RTO-001" required />
                </div>
              </div>

              <div class="mform-row">
                <div class="mfg">
                  <label>Nombre</label>
                  <input v-model="formData.name" type="text" placeholder="Juan Pérez" />
                </div>
                <div class="mfg">
                  <label>Email</label>
                  <input v-model="formData.email" type="email" placeholder="juan@ejemplo.com" />
                </div>
              </div>

              <div class="mform-row">
                <div class="mfg mfg-wide">
                  <label>Dirección</label>
                  <input v-model="formData.address" type="text" placeholder="Av. Siempre Viva 742" />
                </div>
                <div class="mfg">
                  <label>Localidad</label>
                  <input v-model="formData.locality" type="text" placeholder="Buenos Aires" />
                </div>
              </div>

              <div class="mform-row">
                <div class="mfg">
                  <label>Estado *</label>
                  <select v-model="formData.estado" required>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div class="mfg">
                  <label>Tipo de entrega *</label>
                  <select v-model="formData.tipo_entrega" required>
                    <option value="Instalacion">Instalación</option>
                    <option value="Retiro">Retiro</option>
                    <option value="Recambio">Recambio</option>
                    <option value="Service">Service</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
                <div class="mfg">
                  <label>Entregado por *</label>
                  <select v-model="formData.entregado_por" required>
                    <option value="Repartidor">Repartidor</option>
                    <option value="Tecnico">Técnico</option>
                  </select>
                </div>
              </div>

              <div class="mform-row">
                <div class="mfg">
                  <label>Cantidad *</label>
                  <input v-model.number="formData.cantidad" type="number" min="1" max="3" required />
                </div>
                <div class="mfg">
                  <label>Fecha de acción *</label>
                  <input v-model="formData.fecha_accion" type="date" required />
                </div>
                <div class="mfg">
                  <label>Nro. Order</label>
                  <input v-model="formData.order_number" type="text" placeholder="ORD-0001" />
                </div>
              </div>

              <!-- Dispensers -->
              <div class="dispensers-section">
                <div class="ds-header">
                  <span>Items de Dispensers</span>
                  <button type="button" class="btn-add-disp" @click="agregarDispenser">+ Agregar</button>
                </div>
                <div v-for="(item, idx) in formData.item_dispensers" :key="idx" class="ds-row">
                  <select v-model="item.tipo">
                    <option value="P">P (Frío)</option>
                    <option value="M">M (Calor)</option>
                  </select>
                  <input v-model.number="item.cantidad" type="number" min="1" max="3" />
                  <button type="button" class="btn-rm-disp" @click="quitarDispenser(idx)">✕</button>
                </div>
              </div>

              <div v-if="errorModal" class="error-banner">{{ errorModal }}</div>

              <div class="mform-actions">
                <button type="button" class="btn-cancel" @click="cerrarModal">Cancelar</button>
                <button type="submit" class="btn-save" :disabled="guardando">
                  <svg v-if="guardando" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/></svg>
                  {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Entrega') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- ══ MODAL CONFIRMAR CANCELAR ════════════════════════════════════ -->
    <transition name="modal-fade">
      <div v-if="modalCancelar" class="modal-overlay" @mousedown.self="modalCancelar = null">
        <div class="modal modal-sm">
          <div class="modal-header modal-header-warning">
            <h2>Confirmar cancelación</h2>
            <button class="modal-close" @click="modalCancelar = null">✕</button>
          </div>
          <div class="modal-body">
            <p>¿Cancelar la entrega <strong>#{{ modalCancelar?.id }}</strong> ({{ modalCancelar?.nro_cta }})?</p>
            <p class="delete-warn">El estado cambiará a <strong>Cancelado</strong>.</p>
            <div class="mform-actions">
              <button class="btn-cancel" @click="modalCancelar = null">Volver</button>
              <button class="btn-cancel-confirm" @click="cancelar" :disabled="cancelando">
                <svg v-if="cancelando" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/></svg>
                {{ cancelando ? 'Cancelando...' : 'Sí, cancelar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ══ MODAL CONFIRMAR ELIMINAR ════════════════════════════════════ -->
    <transition name="modal-fade">
      <div v-if="modalEliminar" class="modal-overlay" @mousedown.self="modalEliminar = null">
        <div class="modal modal-sm">
          <div class="modal-header modal-header-danger">
            <h2>Confirmar eliminación</h2>
            <button class="modal-close" @click="modalEliminar = null">✕</button>
          </div>
          <div class="modal-body">
            <p>¿Eliminar la entrega <strong>#{{ modalEliminar?.id }}</strong> ({{ modalEliminar?.nro_cta }})?</p>
            <p class="delete-warn">Esta acción no se puede deshacer.</p>
            <div class="mform-actions">
              <button class="btn-cancel" @click="modalEliminar = null">Cancelar</button>
              <button class="btn-delete-confirm" @click="eliminar" :disabled="eliminando">
                <svg v-if="eliminando" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/></svg>
                {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  listarEntregas,
  crearEntrega,
  actualizarEntrega,
  eliminarEntrega,
  cancelarEntrega
} from '@/services/entregaService'

// ── Estado ──────────────────────────────────────────────────────────────
const entregas = ref([])
const pagination = ref({ page: 1, page_size: 20, total: 0, total_pages: 0 })
const cargando = ref(false)
const error = ref('')

const filtros = ref({ estado: '', nro_cta: '', fecha_accion: '' })

// Modal crear/editar
const modalVisible = ref(false)
const modoEdicion = ref(false)
const guardando = ref(false)
const errorModal = ref('')
const formData = ref(formularioVacio())

// Modal eliminar
const modalEliminar = ref(null)
const eliminando = ref(false)

// Modal cancelar
const modalCancelar = ref(null)
const cancelando = ref(false)

// ── KPIs ────────────────────────────────────────────────────────────────
const pendientesCnt = computed(() => entregas.value.filter(e => e.estado === 'Pendiente').length)
const completadosCnt = computed(() => entregas.value.filter(e => e.estado === 'Completado').length)

// ── Lifecycle ───────────────────────────────────────────────────────────
onMounted(() => buscar())

// ── Helpers ─────────────────────────────────────────────────────────────
function formularioVacio() {
  return {
    id: null,
    nro_cta: '', nro_rto: '', name: '', email: '',
    address: '', locality: '',
    cantidad: 1, estado: 'Pendiente',
    tipo_entrega: 'Instalacion', entregado_por: 'Tecnico',
    order_number: '', fecha_accion: '',
    item_dispensers: []
  }
}

function buildParams() {
  const p = { page: pagination.value.page, page_size: pagination.value.page_size }
  if (filtros.value.estado) p.estado = filtros.value.estado
  if (filtros.value.nro_cta.trim()) p.nro_cta = filtros.value.nro_cta.trim()
  if (filtros.value.fecha_accion) p.fecha_accion = filtros.value.fecha_accion
  return p
}

function formatFecha(val) {
  if (!val) return '—'
  return val.substring(0, 10)
}

function badgeEstado(estado) {
  return { 'badge-amber': estado === 'Pendiente', 'badge-green': estado === 'Completado', 'badge-red': estado === 'Cancelado' }
}

function badgeTipo(tipo) {
  const map = { Instalacion: 'badge-blue', Retiro: 'badge-slate', Recambio: 'badge-purple', Service: 'badge-teal', Mixto: 'badge-orange' }
  return map[tipo] ? { [map[tipo]]: true } : {}
}

// ── Buscar / paginar ─────────────────────────────────────────────────────
async function buscar() {
  cargando.value = true
  error.value = ''
  try {
    const res = await listarEntregas(buildParams())
    entregas.value = res.data ?? []
    pagination.value = res.pagination ?? { page: 1, page_size: 20, total: 0, total_pages: 0 }
  } catch (e) {
    error.value = e.message || 'Error al cargar entregas'
  } finally {
    cargando.value = false
  }
}

function limpiarFiltros() {
  filtros.value = { estado: '', nro_cta: '', fecha_accion: '' }
  pagination.value.page = 1
  buscar()
}

function irPagina(n) {
  pagination.value.page = n
  buscar()
}

// ── Modal crear/editar ───────────────────────────────────────────────────
function abrirModalCrear() {
  modoEdicion.value = false
  formData.value = formularioVacio()
  errorModal.value = ''
  modalVisible.value = true
}

function abrirModalEditar(entrega) {
  modoEdicion.value = true
  formData.value = {
    ...entrega,
    fecha_accion: entrega.fecha_accion ? entrega.fecha_accion.substring(0, 10) : '',
    item_dispensers: entrega.item_dispensers ? entrega.item_dispensers.map(d => ({ ...d })) : []
  }
  errorModal.value = ''
  modalVisible.value = true
}

function cerrarModal() {
  if (guardando.value) return
  modalVisible.value = false
}

function agregarDispenser() {
  formData.value.item_dispensers.push({ tipo: 'P', cantidad: 1 })
}

function quitarDispenser(idx) {
  formData.value.item_dispensers.splice(idx, 1)
}

async function guardar() {
  guardando.value = true
  errorModal.value = ''
  try {
    const body = { ...formData.value }
    delete body.id
    if (modoEdicion.value) {
      await actualizarEntrega(formData.value.id, body)
    } else {
      await crearEntrega(body)
    }
    modalVisible.value = false
    await buscar()
  } catch (e) {
    errorModal.value = e.message || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

// ── Modal eliminar ───────────────────────────────────────────────────────
function confirmarEliminar(entrega) {
  modalEliminar.value = entrega
}

async function eliminar() {
  if (!modalEliminar.value) return
  eliminando.value = true
  try {
    await eliminarEntrega(modalEliminar.value.id)
    modalEliminar.value = null
    await buscar()
  } catch (e) {
    error.value = e.message || 'Error al eliminar'
    modalEliminar.value = null
  } finally {
    eliminando.value = false
  }
}

// ── Modal cancelar ───────────────────────────────────────────────────────
function confirmarCancelar(entrega) {
  modalCancelar.value = entrega
}

async function cancelar() {
  if (!modalCancelar.value) return
  cancelando.value = true
  try {
    await cancelarEntrega(modalCancelar.value.id)
    modalCancelar.value = null
    await buscar()
  } catch (e) {
    error.value = e.message || 'Error al cancelar la entrega'
    modalCancelar.value = null
  } finally {
    cancelando.value = false
  }
}
</script>

<style scoped>
.ev { min-height: 100vh; background: #f8fafc; display: flex; flex-direction: column; }

/* Header */
.hdr { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 1.5rem 2rem; color: white; }
.hdr-inner { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
.hdr-left { display: flex; flex-direction: column; gap: 0.4rem; }
.breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: rgba(255,255,255,0.75); }
.breadcrumb svg { width: 12px; height: 12px; }
.bc-active { color: white; font-weight: 600; }
.hdr-title-row { display: flex; align-items: center; gap: 1rem; }
.hdr-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.hdr-icon svg { width: 26px; height: 26px; fill: white; }
.hdr-left h1 { font-size: 1.4rem; font-weight: 800; margin: 0; }
.hdr-left p { font-size: 0.85rem; color: rgba(255,255,255,0.8); margin: 0; }
.hdr-right { flex-shrink: 0; }

.btn-nueva { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: white; color: #1e40af; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-nueva:hover { background: #e0e7ff; }

/* Body */
.body { flex: 1; padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }

/* KPI Strip */
.kpi-strip { display: flex; align-items: center; gap: 0; background: white; border-radius: 14px; padding: 1rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
.kpi-card { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.kpi-sep { width: 1px; height: 40px; background: #e2e8f0; margin: 0 1.25rem; }
.kpi-ico { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-ico svg { width: 20px; height: 20px; }
.kpi-blue { background: #dbeafe; color: #1d4ed8; }
.kpi-amber { background: #fef3c7; color: #d97706; }
.kpi-green { background: #dcfce7; color: #16a34a; }
.kpi-body { display: flex; flex-direction: column; }
.kpi-label { font-size: 0.75rem; color: #64748b; font-weight: 500; }
.kpi-val { font-size: 1.4rem; font-weight: 800; color: #1e293b; line-height: 1.2; }
.kv-amber { color: #d97706; }
.kv-green { color: #16a34a; }

/* Filtros */
.filter-card { background: white; border-radius: 14px; padding: 1.25rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
.filter-grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; }
.fg { display: flex; flex-direction: column; gap: 0.3rem; min-width: 160px; }
.fg label { font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
.fg input, .fg select { padding: 0.55rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; color: #1e293b; background: #f8fafc; outline: none; transition: border 0.2s; }
.fg input:focus, .fg select:focus { border-color: #3b82f6; background: white; }
.fg-actions { flex-direction: row; gap: 0.5rem; align-items: flex-end; }

.btn-buscar { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1.1rem; background: #1e40af; color: white; border: none; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-buscar:hover:not(:disabled) { background: #1d4ed8; }
.btn-buscar:disabled { opacity: 0.6; cursor: default; }
.btn-limpiar { padding: 0.55rem 1rem; background: white; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
.btn-limpiar:hover { border-color: #94a3b8; color: #334155; }

/* Error */
.error-banner { display: flex; align-items: center; gap: 0.5rem; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem; }

/* Tabla */
.table-wrap { background: white; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; overflow: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.tbl thead tr { background: #f8fafc; border-bottom: 2px solid #e2e8f0; }
.tbl th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
.tbl td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.tr-data:hover td { background: #f8fafc; }
.td-center { text-align: center; }
.td-id { font-weight: 700; color: #64748b; font-size: 0.82rem; }
.td-loading, .td-empty { color: #94a3b8; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 2.5rem; }
.td-empty { display: table-cell; }
.td-loading { display: table-cell; }

/* Badges */
.badge { display: inline-flex; align-items: center; padding: 0.2rem 0.65rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
.badge-amber { background: #fef3c7; color: #b45309; }
.badge-green { background: #dcfce7; color: #15803d; }
.badge-red { background: #fee2e2; color: #b91c1c; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-slate { background: #f1f5f9; color: #475569; }
.badge-purple { background: #f3e8ff; color: #7e22ce; }
.badge-teal { background: #ccfbf1; color: #0f766e; }
.badge-orange { background: #ffedd5; color: #c2410c; }

/* Acciones tabla */
.td-actions { display: flex; gap: 0.35rem; }
.btn-icon { padding: 0.35rem; background: #f1f5f9; border: none; border-radius: 6px; cursor: pointer; color: #475569; transition: all 0.15s; display: flex; align-items: center; }
.btn-icon:hover { background: #e0e7ff; color: #1d4ed8; }
.btn-delete:hover { background: #fee2e2; color: #b91c1c; }

/* Paginación */
.pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 0.5rem; }
.pagination button { padding: 0.4rem 0.9rem; border: 1.5px solid #e2e8f0; background: white; border-radius: 8px; font-size: 0.88rem; cursor: pointer; color: #334155; transition: all 0.15s; }
.pagination button:hover:not(:disabled) { border-color: #3b82f6; color: #1d4ed8; }
.pagination button:disabled { opacity: 0.4; cursor: default; }
.pagination span { font-size: 0.88rem; color: #64748b; }

/* ══ MODAL ═══════════════════════════════════════════════════════════ */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal { background: white; border-radius: 18px; width: 100%; max-width: 700px; max-height: 90vh; overflow: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
.modal-header h2 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
.modal-header-danger h2 { color: #b91c1c; }
.modal-header-warning h2 { color: #b45309; }
.modal-close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #94a3b8; padding: 0.2rem 0.5rem; border-radius: 6px; transition: color 0.15s; }
.modal-close:hover { color: #334155; }
.modal-body { padding: 1.5rem; }

/* Form modal */
.mform { display: flex; flex-direction: column; gap: 1rem; }
.mform-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.mfg { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 140px; }
.mfg-wide { flex: 2; }
.mfg label { font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
.mfg input, .mfg select { padding: 0.55rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; color: #1e293b; background: #f8fafc; outline: none; transition: border 0.2s; }
.mfg input:focus, .mfg select:focus { border-color: #3b82f6; background: white; }

/* Dispensers */
.dispensers-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 1rem; }
.ds-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.82rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; }
.btn-add-disp { padding: 0.25rem 0.65rem; background: #e0e7ff; color: #1d4ed8; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.ds-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
.ds-row select { padding: 0.4rem 0.6rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.88rem; flex: 1; }
.ds-row input { padding: 0.4rem 0.6rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.88rem; width: 70px; }
.btn-rm-disp { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem; padding: 0.2rem 0.4rem; border-radius: 4px; }
.btn-rm-disp:hover { color: #ef4444; background: #fee2e2; }

.mform-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
.btn-cancel { padding: 0.6rem 1.2rem; background: white; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; cursor: pointer; transition: all 0.15s; }
.btn-cancel:hover { border-color: #94a3b8; }
.btn-save { display: flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.4rem; background: #1e40af; color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-save:hover:not(:disabled) { background: #1d4ed8; }
.btn-save:disabled { opacity: 0.6; cursor: default; }
.btn-delete-confirm { display: flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.4rem; background: #dc2626; color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
.btn-delete-confirm:hover:not(:disabled) { background: #b91c1c; }
.btn-delete-confirm:disabled { opacity: 0.6; cursor: default; }
.btn-cancel-confirm { display: flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.4rem; background: #d97706; color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
.btn-cancel-confirm:hover:not(:disabled) { background: #b45309; }
.btn-cancel-confirm:disabled { opacity: 0.6; cursor: default; }
.btn-icon.btn-cancel-action { color: #d97706; }
.btn-icon.btn-cancel-action:hover { background: #fef3c7; color: #b45309; }
.delete-warn { font-size: 0.85rem; color: #b91c1c; margin: 0.25rem 0 1rem; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Spin */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
</style>
