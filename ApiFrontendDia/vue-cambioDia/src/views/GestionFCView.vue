<template>
  <div class="gestion-fc-container">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">
        <span class="material-symbols-outlined">
          water_drop
        </span>
      </div>
      <div>
        <h1 class="title">Gestión de Entrega - Dispenser F/C</h1>
        <p class="subtitle">Proceso paso a paso para nuevas entregas</p>
      </div>
    </div>

    <!-- Stepper -->
    <div class="stepper">
      <div 
        v-for="step in steps" 
        :key="step.number"
        :class="['step', { 
          active: pasoActual === step.number, 
          completed: pasoActual > step.number,
          disabled: pasoActual < step.number
        }]"
      >
        <div class="step-number">
          <span v-if="pasoActual > step.number">✓</span>
          <span v-else>{{ step.number }}</span>
        </div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>

    <!-- PASO 1: Verificar Cliente -->
    <transition name="fade">
      <div v-if="pasoActual === 1" class="paso-card">
        <div class="paso-header">
          <h2 class="paso-title">Paso 1: Verificar Cliente</h2>
          <p class="paso-subtitle">Consulte el DNI del cliente para verificar si está registrado</p>
        </div>

        <form @submit.prevent="buscarCliente" class="form">
          <div class="form-group">
            <label class="label">
              <span class="material-symbols-outlined label-icon-mat">forum</span>
              ID Conversación
            </label>
            <input
              v-model="formulario.idConversacion"
              type="text"
              class="input"
              placeholder="Ej: CC-2026-001"
              required
            />
            <p class="help-text">Identificador de la conversación del contact center</p>
          </div>

          <div class="form-group">
            <div class="modo-busqueda-toggle">
              <button
                type="button"
                :class="['modo-btn', { active: modoBusqueda === 'dni' }]"
                @click="cambiarModoBusqueda('dni')"
              >DNI / CUIT</button>
              <button
                type="button"
                :class="['modo-btn', { active: modoBusqueda === 'cuenta' }]"
                @click="cambiarModoBusqueda('cuenta')"
              >Nro. Cuenta</button>
            </div>
            <input
              v-model="formulario.dni"
              type="text"
              class="input"
              :placeholder="modoBusqueda === 'dni' ? 'DNI: 12345678 | CUIT: 30-70938201-9' : 'Ej: 349689'"
              :maxlength="modoBusqueda === 'dni' ? 13 : 10"
              :disabled="cargandoPaso1"
              @input="limpiarResultadoCliente"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="cargandoPaso1 || !formulario.dni.trim() || !formulario.idConversacion.trim()"
          >
            <svg v-if="!cargandoPaso1" class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
            </svg>
            <svg v-else class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
            </svg>
            {{ cargandoPaso1 ? 'Buscando...' : 'Buscar Cliente' }}
          </button>
        </form>

        <!-- Resultado Cliente -->
        <transition name="slide-up">
          <div v-if="datosCliente" class="result-card success">
            <div class="result-header">
              <svg class="result-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3>Cliente Encontrado</h3>
            </div>
            <div class="result-data">
              <div class="data-row">
                <span class="data-label">Código:</span>
                <span class="data-value">{{ datosCliente.codCliente }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Nombre:</span>
                <span class="data-value">{{ datosCliente.nombre }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Dirección:</span>
                <span class="data-value">{{ datosCliente.direccion }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Localidad:</span>
                <span class="data-value">{{ datosCliente.localidad }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Reparto:</span>
                <span class="data-value">{{ datosCliente.idReparto }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Día de Visita:</span>
                <span class="data-value">{{ datosCliente.nombreDiaVisita }}</span>
              </div>
            </div>
            <button @click="continuarPaso2" class="btn btn-primary">
              Continuar al Paso 2
            </button>
          </div>
        </transition>

        <!-- Múltiples cuentas: selector -->
        <transition name="slide-up">
          <div v-if="listaClientes.length > 0" class="result-card info">
            <div class="result-header">
              <svg class="result-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
              <h3>{{ listaClientes.length }} cuentas encontradas — Seleccioná la que corresponde</h3>
            </div>
            <div class="clientes-lista">
              <button
                v-for="cliente in listaClientes"
                :key="cliente.codCliente"
                class="cliente-item"
                @click="seleccionarCliente(cliente)"
              >
                <div class="cliente-item-header">
                  <span class="cliente-cod">Cta. {{ cliente.codCliente }}</span>
                  <span class="cliente-reparto">Reparto {{ cliente.idReparto }}</span>
                </div>
                <div class="cliente-item-dir">{{ cliente.direccion }}, {{ cliente.localidad }}</div>
                <div class="cliente-item-visita">{{ cliente.nombreDiaVisita }} · Próx. visita: {{ cliente.fechaProxVisita }}</div>
              </button>
            </div>
          </div>
        </transition>

        <transition name="slide-up">
          <div v-if="clienteNoEncontrado" class="result-card warning">
            <div class="result-header">
              <svg class="result-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <h3>Cliente No Registrado</h3>
            </div>
            <p class="result-message">
              El DNI consultado no se encuentra en el sistema. Puede continuar el proceso igualmente.
            </p>
            <button @click="continuarPaso2SinCliente" class="btn btn-secondary">
              Continuar de Todos Modos
            </button>
          </div>
        </transition>

        <!-- Error -->
        <transition name="fade">
          <div v-if="errorPaso1" class="alert-error">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{{ errorPaso1 }}</p>
          </div>
        </transition>
      </div>
    </transition>

    <!-- PASO 2: Consultar SIISA -->
    <transition name="fade">
      <div v-if="pasoActual === 2" class="paso-card">
        <div class="paso-header">
          <h2 class="paso-title">Paso 2: Verificar Situación Financiera (SIISA)</h2>
          <p class="paso-subtitle">Consulta automática en Central de Deudores BCRA</p>
        </div>

        <!-- Mostrar datos del cliente si existen -->
        <div v-if="datosCliente" class="info-box">
          <strong>Cliente:</strong> {{ datosCliente.nombre }} (DNI: {{ formulario.dni }})
        </div>

        <form @submit.prevent="consultarSIISA" class="form">
          <div v-if="modoBusqueda === 'cuenta'" class="form-group">
            <label class="label">
              <span class="material-symbols-outlined label-icon-mat">badge</span>
              CUIT del cliente
            </label>
            <input
              v-model="cuitSiisa"
              type="text"
              class="input"
              placeholder="Ej: 30-70938201-9"
              maxlength="13"
              :disabled="cargandoPaso2"
            />
          </div>

          <div class="form-group">
            <label class="label">
              <svg class="label-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
              </svg>
              Sexo (requerido para SIISA)
            </label>
            <select v-model="formulario.sexo" class="input" :disabled="cargandoPaso2">
              <option value="">Seleccionar...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="cargandoPaso2 || !formulario.sexo || (modoBusqueda === 'cuenta' && !cuitSiisa.trim())"
          >
            <svg v-if="!cargandoPaso2" class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
            </svg>
            <svg v-else class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
            </svg>
            {{ cargandoPaso2 ? 'Consultando BCRA...' : 'Consultar SIISA' }}
          </button>
        </form>

        <!-- Resultado SIISA -->
        <transition name="slide-up">
          <div v-if="datosSIISA" class="result-card">
            <div class="semaforo-result" :style="{ 
              backgroundColor: semaforoEstilo.bg, 
              borderColor: semaforoEstilo.border 
            }">
              <div class="semaforo-header">
                <div class="semaforo-circle" :style="{ backgroundColor: semaforoEstilo.border }"></div>
                <h3 :style="{ color: semaforoEstilo.text }">
                  Situación: {{ colorSemaforo }}
                </h3>
              </div>
              <div class="semaforo-details" :style="{ color: semaforoEstilo.text }">
                <p><strong>Scoring:</strong> {{ datosSIISA.semaforo?.situacion || 'N/A' }}</p>
                <p v-if="datosSIISA.semaforo?.situacion_maxima_label">
                  <strong>Categoría BCRA:</strong> {{ datosSIISA.semaforo.situacion_maxima_label }}
                </p>
              </div>
            </div>

            <!-- Decisión según semáforo -->
            <div v-if="requiereRevision" class="alert-warning">
              <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <div>
                <h4>Cliente Requiere Revisión</h4>
                <p>El semáforo está en ROJO. El cliente será derivado a revisión manual.</p>
              </div>
            </div>

            <div class="btn-group">
              <button v-if="requiereRevision" @click="enviarARevision" class="btn btn-warning">
                Enviar a Revisión
              </button>
              <button v-if="requiereRevision" @click="continuarPaso3" class="btn btn-secondary">
                Continuar igual
              </button>
              <button v-if="!requiereRevision" @click="continuarPaso3" class="btn btn-primary">
                Continuar al Paso 3
              </button>
              <button v-if="!requiereRevision" @click="continuarPaso3SinTerminos" class="btn btn-secondary">
                Omitir T&amp;C
              </button>
              <button @click="volverPaso1" class="btn btn-secondary">
                Volver al Paso 1
              </button>
            </div>
          </div>
        </transition>

        <!-- Error -->
        <transition name="fade">
          <div v-if="errorPaso2" class="alert-error">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{{ errorPaso2 }}</p>
          </div>
        </transition>
      </div>
    </transition>

    <!-- PASO 3: Generar Términos y Condiciones -->
    <transition name="fade">
      <div v-if="pasoActual === 3" class="paso-card">
        <div class="paso-header">
          <h2 class="paso-title">Paso 3: Generar Términos y Condiciones</h2>
          <p class="paso-subtitle">Generar enlace de T&C para enviar al cliente</p>
        </div>

        <div v-if="datosCliente" class="info-box">
          <strong>Cliente:</strong> {{ datosCliente.nombre }} (DNI: {{ formulario.dni }})
        </div>

        <div class="form-group">
          <label class="label">
            <span class="material-symbols-outlined label-icon-mat">payments</span>
            Reparto de entrega
          </label>
          <input
            v-model.number="deliveryMonto"
            type="number"
            class="input"
            placeholder="Ej: 250"
            min="0"
            :disabled="!!datosTerminos"
          />
        </div>

        <button
          @click="generarTerminos"
          class="btn btn-primary"
          :disabled="cargandoPaso3 || datosTerminos || !deliveryMonto"
        >
          <svg v-if="!cargandoPaso3" class="btn-icon" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T740-80H240Zm280-520v-200H240v640h500v-440H520ZM240-800v200-200 640-640Z"/>
          </svg>
          <svg v-else class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
          </svg>
          {{ cargandoPaso3 ? 'Generando...' : 'Generar Términos y Condiciones' }}
        </button>

        <!-- Resultado T&C -->
        <transition name="slide-up">
          <div v-if="datosTerminos" class="result-card" :class="tycAceptados ? 'success' : 'info'">
            <div class="result-header">
              <svg v-if="tycAceptados" class="result-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <svg v-else class="result-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <h3>{{ tycAceptados ? 'Términos Aceptados por el Cliente' : 'Términos y Condiciones Generados' }}</h3>
            </div>
            <div class="tyc-link-box">
              <p class="tyc-label">Enlace para el cliente:</p>
              <div class="tyc-url-row">
                <a :href="datosTerminos.url" target="_blank" rel="noopener noreferrer" class="tyc-url">{{ datosTerminos.url }}</a>
                <button class="btn-copy-tyc" @click="copiarURLTerminos" :class="{ copied: tycCopiado }">
                  <span class="material-symbols-outlined">{{ tycCopiado ? 'check' : 'content_copy' }}</span>
                </button>
              </div>
              <p class="tyc-expira">Expira: {{ formatearFechaISO(datosTerminos.expiresAt) }}</p>
            </div>

            <!-- Estado de aceptación -->
            <div v-if="!tycAceptados" class="tyc-polling-box">
              <div class="tyc-polling-indicator">
                <svg class="tyc-polling-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
                </svg>
                <span>Esperando que el cliente acepte los términos...</span>
              </div>
              <p class="tyc-polling-hint">El estado se actualiza automáticamente cada 4 segundos</p>
            </div>

            <div v-else class="tyc-accepted-box">
              <div class="tyc-accepted-badge">
                <span class="material-symbols-outlined">verified</span>
                <span>ACEPTADO</span>
              </div>
              <p class="tyc-accepted-date">Aceptado el: {{ formatearFechaISO(estadoTerminos.acceptedAt) }}</p>
            </div>

            <div class="btn-group">
              <button @click="continuarPaso4" class="btn btn-primary" :disabled="!tycAceptados">
                <span class="material-symbols-outlined btn-icon-mat">arrow_forward</span>
                Continuar al Paso 4
              </button>
              <button @click="volverPaso2" class="btn btn-secondary">
                Volver al Paso 2
              </button>
            </div>
          </div>
        </transition>

        <!-- Error -->
        <transition name="fade">
          <div v-if="errorPaso3" class="alert-error">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{{ errorPaso3 }}</p>
          </div>
        </transition>
      </div>
    </transition>

    <!-- PASO 4: Tipo de Dispenser -->
    <transition name="fade">
      <div v-if="pasoActual === 4" class="paso-card">
        <div class="paso-header">
          <h2 class="paso-title">Paso 4: Seleccionar Tipo de Dispenser</h2>
          <p class="paso-subtitle">Elija el modelo solicitado por el cliente</p>
        </div>

        <div v-if="datosCliente" class="info-box">
          <strong>Cliente:</strong> {{ datosCliente.nombre }}
        </div>

        <form @submit.prevent="continuarPaso5" class="form">
          <div class="form-group">
            <label class="label">
              <svg class="label-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M640-520q25 0 42.5-17.5T700-580q0-25-17.5-42.5T640-640q-25 0-42.5 17.5T580-580q0 25 17.5 42.5T640-520Zm-320-80h200v-80H320v80ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Z"/>
              </svg>
              Tipo y Cantidad de Dispensers
            </label>
            <p class="help-text">Ingrese la cantidad de cada tipo</p>
          </div>

          <div class="dispenser-grid">
            <div class="form-group">
              <label class="label">
                <svg class="label-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Z"/>
                </svg>
                Pie (P)
              </label>
              <input v-model.number="formulario.cantidadPie" type="number" class="input" min="0" placeholder="0" />
            </div>

            <div class="form-group">
              <label class="label">
                <svg class="label-icon" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M160-120v-80h640v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Z"/>
                </svg>
                Mesada (M)
              </label>
              <input v-model.number="formulario.cantidadMesada" type="number" class="input" min="0" placeholder="0" />
            </div>
          </div>

          <div v-if="totalDispensers > 0" class="info-box">
            <strong>Total:</strong> {{ totalDispensers }} dispenser(s) seleccionado(s)
          </div>

          <div class="form-group">
            <label class="label">
              <span class="material-symbols-outlined label-icon-mat">email</span>
              Email del Cliente
            </label>
            <input
              v-model="formulario.email"
              type="email"
              class="input"
              placeholder="ejemplo@correo.com"
              required
            />
            <p class="help-text">Se enviará la confirmación de instalación a este correo</p>
          </div>

          <div class="btn-group">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="totalDispensers === 0 || totalDispensers > 3 || !formulario.email"
            >
              Continuar al Paso 5
            </button>
            <button type="button" @click="volverPaso3" class="btn btn-secondary">
              Volver al Paso 3
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- PASO 5: Verificar Jaula -->
    <transition name="fade">
      <div v-if="pasoActual === 5" class="paso-card">
        <div class="paso-header">
          <h2 class="paso-title">Paso 5: Verificar Disponibilidad en Jaula</h2>
          <p class="paso-subtitle">Consultando espacio disponible para el reparto</p>
        </div>

        <!-- Resumen pre-verificación -->
        <div v-if="!datosEntrega" class="resumen-final">
          <div class="resumen-final-header">
            <span class="material-symbols-outlined resumen-icon">summarize</span>
            <h3>Resumen de la Instalación</h3>
          </div>
          <div class="resumen-final-grid">
            <div class="resumen-item">
              <span class="material-symbols-outlined resumen-item-icon">person</span>
              <div>
                <span class="resumen-label">Cliente</span>
                <span class="resumen-value">{{ datosCliente?.nombre || 'N/A' }}</span>
              </div>
            </div>
            <div class="resumen-item">
              <span class="material-symbols-outlined resumen-item-icon">badge</span>
              <div>
                <span class="resumen-label">Cuenta</span>
                <span class="resumen-value">{{ datosCliente?.codCliente || 'N/A' }}</span>
              </div>
            </div>
            <div class="resumen-item">
              <span class="material-symbols-outlined resumen-item-icon">local_shipping</span>
              <div>
                <span class="resumen-label">Reparto</span>
                <input
                  type="text"
                  v-model="formulario.idReparto"
                  class="input input-fecha-visita"
                  placeholder="Nro. reparto"
                />
              </div>
            </div>
            <div class="resumen-item">
              <span class="material-symbols-outlined resumen-item-icon">calendar_month</span>
              <div>
                <span class="resumen-label">Fecha Visita</span>
                <input
                  type="date"
                  v-model="formulario.fechaVisita"
                  class="input input-fecha-visita"
                />
              </div>
            </div>
            <div class="resumen-item">
              <span class="material-symbols-outlined resumen-item-icon">water_drop</span>
              <div>
                <span class="resumen-label">Dispensers</span>
                <span class="resumen-value">{{ formulario.cantidadPie }} Pie · {{ formulario.cantidadMesada }} Mesada</span>
              </div>
            </div>
            <div class="resumen-item">
              <span class="material-symbols-outlined resumen-item-icon">mail</span>
              <div>
                <span class="resumen-label">Email</span>
                <span class="resumen-value">{{ formulario.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <button v-if="!datosEntrega" @click="verificarJaula" class="btn btn-primary" :disabled="cargandoPaso5">
          <span v-if="!cargandoPaso5" class="material-symbols-outlined btn-icon-mat">local_shipping</span>
          <svg v-else class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
          </svg>
          {{ cargandoPaso5 ? 'Verificando y creando entrega...' : 'Verificar Disponibilidad y Crear Entrega' }}
        </button>

        <!-- Resultado exitoso con entrega -->
        <transition name="slide-up">
          <div v-if="datosEntrega" class="entrega-exitosa-card">
            <div class="entrega-exitosa-header">
              <div class="entrega-exitosa-check">
                <span class="material-symbols-outlined">check_circle</span>
              </div>
              <h3>Instalación Registrada Exitosamente</h3>
              <p>La entrega ha sido creada y agendada en el sistema de contact center</p>
            </div>

            <div class="entrega-exitosa-body">
              <!-- Token prominente -->
              <div class="token-display">
                <span class="token-label">
                  <span class="material-symbols-outlined">key</span>
                  Token de Entrega para el Cliente
                </span>
                <div class="token-value-row">
                  <span class="token-value">{{ datosEntrega.token }}</span>
                  <button class="btn-copy-token" @click="copiarTokenEntrega" :class="{ copied: tokenEntregaCopiado }">
                    <span class="material-symbols-outlined">{{ tokenEntregaCopiado ? 'check' : 'content_copy' }}</span>
                    <span class="btn-copy-label">{{ tokenEntregaCopiado ? 'Copiado' : 'Copiar' }}</span>
                  </button>
                </div>
              </div>

              <!-- Detalle de la entrega -->
              <div class="entrega-detalle-grid">
                <div class="entrega-detalle-item">
                  <span class="material-symbols-outlined">person</span>
                  <div>
                    <span class="detalle-label">Cliente</span>
                    <span class="detalle-value">{{ datosCliente?.nombre }}</span>
                  </div>
                </div>
                <div class="entrega-detalle-item">
                  <span class="material-symbols-outlined">badge</span>
                  <div>
                    <span class="detalle-label">Cuenta</span>
                    <span class="detalle-value">{{ datosCliente?.codCliente }}</span>
                  </div>
                </div>
                <div class="entrega-detalle-item">
                  <span class="material-symbols-outlined">local_shipping</span>
                  <div>
                    <span class="detalle-label">Reparto</span>
                    <span class="detalle-value">{{ datosCliente?.idReparto }}</span>
                  </div>
                </div>
                <div class="entrega-detalle-item">
                  <span class="material-symbols-outlined">calendar_month</span>
                  <div>
                    <span class="detalle-label">Fecha</span>
                    <span class="detalle-value">{{ datosCliente?.fechaProxVisita }}</span>
                  </div>
                </div>
                <div class="entrega-detalle-item">
                  <span class="material-symbols-outlined">water_drop</span>
                  <div>
                    <span class="detalle-label">Dispensers</span>
                    <span class="detalle-value">{{ formulario.cantidadPie }}P · {{ formulario.cantidadMesada }}M</span>
                  </div>
                </div>
                <div class="entrega-detalle-item">
                  <span class="material-symbols-outlined">forum</span>
                  <div>
                    <span class="detalle-label">ID Conversación</span>
                    <span class="detalle-value">{{ formulario.idConversacion }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="entrega-exitosa-footer">
              <button @click="resetearFormulario" class="btn btn-primary">
                <span class="material-symbols-outlined btn-icon-mat">add_circle</span>
                Nueva Instalación
              </button>
            </div>
          </div>
        </transition>

        <!-- Resultado Jaula sin entrega (error en entrega) -->
        <transition name="slide-up">
          <div v-if="datosJaula && !datosEntrega && !cargandoPaso5 && !errorPaso5" class="result-card">
            <div class="jaula-result" :class="{ 
              success: datosJaula.disponibilidad > 0, 
              error: datosJaula.disponibilidad === 0 
            }">
              <div v-if="datosJaula.disponibilidad === 0" class="alert-error">
                <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>No hay espacio disponible en el camión. Contacte con logística.</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- Error -->
        <transition name="fade">
          <div v-if="errorPaso5" class="alert-error">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{{ errorPaso5 }}</p>
            <button @click="volverPaso4" class="btn btn-secondary" style="margin-top: 0.75rem;">
              Volver al Paso 4
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { consultarClientePorDNI, consultarClientePorCodigo } from '../services/clienteService'
import { SiisaService } from '../services/siisaService'
import { consultarDisponibilidadJaula, agendarVisita } from '../services/jaulaService'
import { apiClient } from '../services/api.client'
import { API_CONFIG } from '../config/api.config'
import { SIISA_COLORS } from '../constants'

// Estado del proceso
const pasoActual = ref(1)
const steps = [
  { number: 1, label: 'Verificar Cliente' },
  { number: 2, label: 'Consultar SIISA' },
  { number: 3, label: 'Términos y Cond.' },
  { number: 4, label: 'Tipo Dispenser' },
  { number: 5, label: 'Verificar Jaula' }
]

// Formulario
const formulario = ref({
  idConversacion: '',
  dni: '',
  sexo: '',
  cantidadPie: 0,
  cantidadMesada: 0,
  email: '',
  fechaVisita: '',
  idReparto: ''
})

// Computed property para el total de dispensers
const totalDispensers = computed(() => {
  return formulario.value.cantidadPie + formulario.value.cantidadMesada
})

// Paso 1: Cliente
const cargandoPaso1 = ref(false)
const errorPaso1 = ref('')
const datosCliente = ref(null)
const listaClientes = ref([])
const clienteNoEncontrado = ref(false)
const modoBusqueda = ref('dni') // 'dni' | 'cuenta'

async function buscarCliente() {
  cargandoPaso1.value = true
  errorPaso1.value = ''
  datosCliente.value = null
  listaClientes.value = []
  clienteNoEncontrado.value = false

  try {
    const clientes = modoBusqueda.value === 'cuenta'
      ? await consultarClientePorCodigo(formulario.value.dni)
      : await consultarClientePorDNI(formulario.value.dni)

    if (clientes.length === 1) {
      datosCliente.value = clientes[0]
    } else {
      listaClientes.value = clientes
    }
  } catch (error) {
    console.error('Error buscando cliente:', error)
    if (error.message.includes('No se encontró')) {
      clienteNoEncontrado.value = true
    } else {
      errorPaso1.value = error.message || 'Error al consultar el cliente'
    }
  } finally {
    cargandoPaso1.value = false
  }
}

function seleccionarCliente(cliente) {
  datosCliente.value = cliente
  listaClientes.value = []
}

function cambiarModoBusqueda(modo) {
  modoBusqueda.value = modo
  formulario.value.dni = ''
  limpiarResultadoCliente()
}

function limpiarResultadoCliente() {
  datosCliente.value = null
  listaClientes.value = []
  clienteNoEncontrado.value = false
  errorPaso1.value = ''
}

function continuarPaso2() {
  pasoActual.value = 2
}

function continuarPaso2SinCliente() {
  pasoActual.value = 2
}

// Paso 2: SIISA
const cargandoPaso2 = ref(false)
const errorPaso2 = ref('')
const datosSIISA = ref(null)
const cuitSiisa = ref('')

const colorSemaforo = computed(() => {
  return datosSIISA.value?.semaforo?.color?.toUpperCase() || 'ROJO'
})

const semaforoEstilo = computed(() => {
  return SIISA_COLORS[colorSemaforo.value] || SIISA_COLORS.ROJO
})

const requiereRevision = computed(() => {
  return colorSemaforo.value === 'ROJO'
})

async function consultarSIISA() {
  cargandoPaso2.value = true
  errorPaso2.value = ''
  datosSIISA.value = null

  try {
    const docParaSiisa = modoBusqueda.value === 'cuenta'
      ? cuitSiisa.value.replace(/-/g, '')
      : formulario.value.dni.replace(/-/g, '')
    const respuesta = await SiisaService.consultarPersona(
      docParaSiisa,
      formulario.value.sexo
    )
    datosSIISA.value = respuesta.datos_completos
  } catch (error) {
    console.error('Error consultando SIISA:', error)
    errorPaso2.value = error.message || 'Error al consultar SIISA'
  } finally {
    cargandoPaso2.value = false
  }
}

function enviarARevision() {
  // TODO: Implementar lógica para enviar a vista de revisión
  alert('Cliente enviado a revisión manual. El flujo termina aquí.')
  resetearFormulario()
}

function continuarPaso3() {
  pasoActual.value = 3
}

function continuarPaso3SinTerminos() {
  pasoActual.value = 4
}

function volverPaso1() {
  pasoActual.value = 1
  datosSIISA.value = null
  cuitSiisa.value = ''
  errorPaso2.value = ''
}

function volverPaso2() {
  pasoActual.value = 2
  datosTerminos.value = null
  deliveryMonto.value = null
  errorPaso3.value = ''
}

// Paso 3: Términos y Condiciones
const cargandoPaso3 = ref(false)
const errorPaso3 = ref('')
const datosTerminos = ref(null)
const deliveryMonto = ref(null)
const tycCopiado = ref(false)
const sessionIdGenerado = ref('')
const pollingTerminos = ref(false)
const estadoTerminos = ref(null) // { token, status, expiresAt, acceptedAt }
let pollingIntervalId = null

async function generarTerminos() {
  cargandoPaso3.value = true
  errorPaso3.value = ''
  datosTerminos.value = null
  estadoTerminos.value = null

  try {
    // Usar el ID de conversación como sessionId
    const sessionId = formulario.value.idConversacion
    sessionIdGenerado.value = sessionId
    
    const data = await apiClient.post(API_CONFIG.ENDPOINTS.CONTACT_CENTER_SESSION, {
      sessionId,
      conversationId: sessionId,
      delivery: deliveryMonto.value
    })

    datosTerminos.value = data
    // Iniciar polling automáticamente
    iniciarPollingTerminos()
  } catch (error) {
    console.error('Error generando T&C:', error)
    errorPaso3.value = error.message || 'Error al generar términos y condiciones'
  } finally {
    cargandoPaso3.value = false
  }
}

function iniciarPollingTerminos() {
  detenerPollingTerminos()
  pollingTerminos.value = true
  
  pollingIntervalId = setInterval(async () => {
    try {
      const data = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.TERMS_BY_SESSION}/${sessionIdGenerado.value}`
      )
      estadoTerminos.value = data

      if (data.status === 'ACCEPTED') {
        detenerPollingTerminos()
      }
    } catch (error) {
      console.error('Error polling T&C:', error)
      // No detener el polling por un error transitorio
    }
  }, 4000) // Cada 4 segundos
}

function detenerPollingTerminos() {
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId)
    pollingIntervalId = null
  }
  pollingTerminos.value = false
}

// Limpiar polling al desmontar componente
onUnmounted(() => {
  detenerPollingTerminos()
})

const tycAceptados = computed(() => estadoTerminos.value?.status === 'ACCEPTED')

async function copiarURLTerminos() {
  if (!datosTerminos.value?.url) return
  try {
    await navigator.clipboard.writeText(datosTerminos.value.url)
    tycCopiado.value = true
    setTimeout(() => { tycCopiado.value = false }, 2000)
  } catch { /* ignore */ }
}

function formatearFechaISO(fechaISO) {
  if (!fechaISO) return ''
  const fecha = new Date(fechaISO)
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const anio = fecha.getFullYear()
  const hora = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${anio} ${hora}:${min}`
}

function continuarPaso4() {
  pasoActual.value = 4
}

function volverPaso3() {
  pasoActual.value = 3
  formulario.value.cantidadPie = 0
  formulario.value.cantidadMesada = 0
}

// Paso 4: Tipo Dispenser
function continuarPaso5() {
  // Pre-llenar fechaVisita desde datosCliente (DD/MM/YYYY → YYYY-MM-DD)
  if (datosCliente.value?.fechaProxVisita) {
    const [dia, mes, anio] = datosCliente.value.fechaProxVisita.split('/')
    formulario.value.fechaVisita = `${anio}-${mes}-${dia}`
  }
  // Pre-llenar idReparto desde datosCliente
  if (datosCliente.value?.idReparto) {
    formulario.value.idReparto = String(datosCliente.value.idReparto)
  }
  pasoActual.value = 5
}

function volverPaso4() {
  pasoActual.value = 4
  datosJaula.value = null
  errorPaso5.value = ''
}

// Paso 5: Jaula
const cargandoPaso5 = ref(false)
const errorPaso5 = ref('')
const datosJaula = ref(null)
const agendamientoExitoso = ref(false)
const datosEntrega = ref(null)
const tokenEntregaCopiado = ref(false)

async function copiarTokenEntrega() {
  if (!datosEntrega.value?.token) return
  try {
    await navigator.clipboard.writeText(datosEntrega.value.token)
    tokenEntregaCopiado.value = true
    setTimeout(() => { tokenEntregaCopiado.value = false }, 2000)
  } catch { /* ignore */ }
}

async function verificarJaula() {
  if (!formulario.value.idReparto) {
    errorPaso5.value = 'Por favor ingrese el número de reparto'
    return
  }

  if (!formulario.value.fechaVisita) {
    errorPaso5.value = 'Por favor ingrese una fecha de visita'
    return
  }

  cargandoPaso5.value = true
  errorPaso5.value = ''
  datosJaula.value = null
  agendamientoExitoso.value = false
  datosEntrega.value = null

  try {
    // Primero consultamos disponibilidad para mostrar al usuario
    const disponibilidad = await consultarDisponibilidadJaula(formulario.value.idReparto)
    datosJaula.value = disponibilidad

    // Luego intentamos agendar la visita (convertir YYYY-MM-DD → DD/MM/YYYY para agendarVisita)
    const [anio, mes, dia] = formulario.value.fechaVisita.split('-')
    const fechaDDMMYYYY = `${dia}/${mes}/${anio}`
    const resultado = await agendarVisita(
      formulario.value.idReparto,
      fechaDDMMYYYY,
      totalDispensers.value
    )

    agendamientoExitoso.value = resultado === true || resultado.success === true
    
    if (!agendamientoExitoso.value) {
      errorPaso5.value = 'No se pudo agendar la visita. Espacio insuficiente en la jaula.'
      return
    }

    // Si el agendamiento fue exitoso, crear la entrega via contact-center
    console.log('📦 Creando entrega contact-center...')
    
    // Usar fechaVisita ya en formato YYYY-MM-DD
    const fechaFormateada = formulario.value.fechaVisita
    
    const entrega = await apiClient.post(API_CONFIG.ENDPOINTS.DELIVERIES_CONTACT_CENTER, {
      nro_cta: String(datosCliente.value.codCliente),
      nro_rto: formulario.value.idReparto,
      email: formulario.value.email,
      tipos: {
        P: formulario.value.cantidadPie,
        M: formulario.value.cantidadMesada
      },
      tipo_entrega: 'Instalacion',
      entregado_por: 'Repartidor',
      session_id: formulario.value.idConversacion,
      conversation_id: formulario.value.idConversacion,
      fecha_accion: fechaFormateada
    })

    if (!entrega) {
      errorPaso5.value = 'No se pudo crear la entrega en el sistema'
      return
    }

    datosEntrega.value = entrega
    console.log('✅ Entrega contact-center creada:', entrega)
    
  } catch (error) {
    console.error('Error verificando jaula:', error)
    errorPaso5.value = error.message || 'Error al verificar disponibilidad en jaula'
  } finally {
    cargandoPaso5.value = false
  }
}

// Utilidades
function resetearFormulario() {
  detenerPollingTerminos()
  pasoActual.value = 1
  formulario.value = {
    idConversacion: '',
    dni: '',
    sexo: '',
    cantidadPie: 0,
    cantidadMesada: 0,
    email: '',
    fechaVisita: '',
    idReparto: ''
  }
  datosCliente.value = null
  listaClientes.value = []
  clienteNoEncontrado.value = false
  datosSIISA.value = null
  cuitSiisa.value = ''
  datosTerminos.value = null
  deliveryMonto.value = null
  estadoTerminos.value = null
  sessionIdGenerado.value = ''
  datosJaula.value = null
  agendamientoExitoso.value = false
  datosEntrega.value = null
  tokenEntregaCopiado.value = false
  errorPaso1.value = ''
  errorPaso2.value = ''
  errorPaso3.value = ''
  errorPaso5.value = ''
}

// Función auxiliar para formatear fecha ISO a DD/MM/YYYY
function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
  // Si la fecha viene en formato ISO con Z (UTC), usar métodos UTC para evitar problemas de zona horaria
  const fecha = new Date(fechaISO)
  const dia = String(fecha.getUTCDate()).padStart(2, '0')
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0')
  const anio = fecha.getUTCFullYear()
  return `${dia}/${mes}/${anio}`
}
</script>

<style scoped>
.gestion-fc-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.header-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.header-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.header-icon .material-symbols-outlined {
  font-size: 48px;
  color: white;
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  font-weight: 500;
}

/* Stepper */
.stepper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  position: relative;
}

.stepper::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981 0%, #667eea 50%, #e5e7eb 100%);
  border-radius: 0 0 16px 16px;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 24px;
  left: 50%;
  width: 100%;
  height: 3px;
  background: #e5e7eb;
  z-index: 0;
  transition: all 0.4s ease;
}

.step.completed:not(:last-child)::after {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.step.active:not(:last-child)::after {
  background: linear-gradient(90deg, #667eea 0%, #e5e7eb 100%);
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 3px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.2);
  border-color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.3);
  }
}

.step.completed .step-number {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-color: #d1fae5;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.step-label {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s;
}

.step.active .step-label {
  color: #667eea;
  font-weight: 700;
  font-size: 0.9rem;
}

.step.completed .step-label {
  color: #10b981;
  font-weight: 600;
}

/* Paso Card */
.paso-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.paso-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.paso-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
  position: relative;
}

.paso-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.paso-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.paso-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

/* Form */
.form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  font-weight: 500;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
  background: white;
  transform: translateY(-1px);
}

.input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-label:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.radio-label input[type="radio"]:checked + .radio-text {
  color: #667eea;
  font-weight: 600;
}

.radio-label input[type="radio"]:checked {
  accent-color: #667eea;
}

.radio-text {
  font-size: 1rem;
  color: #374151;
}

/* Dispenser Grid */
.dispenser-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before:not(:disabled) {
  width: 300px;
  height: 300px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Result Cards */
.result-card {
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  animation: slideIn 0.4s ease-out;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.result-card.success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #10b981;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.result-card.warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.result-icon {
  width: 32px;
  height: 32px;
}

.result-card.success .result-icon {
  color: #10b981;
}

.result-card.warning .result-icon {
  color: #f59e0b;
}

.result-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.result-data {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.data-label {
  font-weight: 600;
  color: #374151;
}

.data-value {
  color: #1f2937;
}

.result-message {
  margin: 0;
  color: #92400e;
}

/* Info Box */
.info-box {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #93c5fd;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  color: #1e40af;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
  position: relative;
  overflow: hidden;
}

.info-box::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
}

/* Semaforo Result */
.semaforo-result {
  padding: 2rem;
  border-radius: 12px;
  border: 3px solid;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.semaforo-result::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: currentColor;
  opacity: 0.5;
}

.semaforo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.semaforo-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.semaforo-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.semaforo-details p {
  margin: 0.5rem 0;
}

/* Jaula Result */
.jaula-result {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid;
}

.jaula-result.success {
  background: #d1fae5;
  border-color: #10b981;
}

.jaula-result.error {
  background: #fee2e2;
  border-color: #ef4444;
}

.jaula-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.jaula-icon {
  width: 40px;
  height: 40px;
  color: #374151;
}

.jaula-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.jaula-disponibilidad {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Alerts */
.alert-error,
.alert-warning,
.alert-success {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-error {
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

.alert-warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
}

.alert-success {
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.alert-warning h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.alert-warning p {
  margin: 0;
  font-size: 0.875rem;
}

/* T&C Link Box */
.tyc-link-box {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #93c5fd;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin: 1.5rem 0;
}

.tyc-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tyc-url-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid #bfdbfe;
}

.tyc-url {
  flex: 1;
  color: #2563eb;
  font-size: 0.85rem;
  word-break: break-all;
  text-decoration: none;
  font-weight: 500;
}

.tyc-url:hover {
  text-decoration: underline;
}

.btn-copy-tyc {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid #93c5fd;
  background: white;
  color: #2563eb;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-copy-tyc:hover {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.btn-copy-tyc.copied {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-copy-tyc .material-symbols-outlined {
  font-size: 18px;
}

.tyc-expira {
  margin: 0.75rem 0 0;
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
}

/* T&C Polling / Accepted States */
.tyc-polling-box {
  background: #fffbeb;
  border: 2px solid #fbbf24;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  text-align: center;
}

.tyc-polling-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #92400e;
  font-size: 0.9rem;
}

.tyc-polling-spinner {
  width: 22px;
  height: 22px;
  stroke: #f59e0b;
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

.tyc-polling-hint {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #a16207;
}

.tyc-accepted-box {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #34d399;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  text-align: center;
}

.tyc-accepted-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #059669;
  letter-spacing: 1px;
}

.tyc-accepted-badge .material-symbols-outlined {
  font-size: 24px;
  color: #059669;
}

.tyc-accepted-date {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: #047857;
}

.btn-icon-mat {
  font-size: 18px;
  vertical-align: middle;
  margin-right: 4px;
}

.label-icon-mat {
  font-size: 20px;
  vertical-align: middle;
  margin-right: 6px;
  color: #6366f1;
}

/* Entrega Exitosa Card */
.entrega-exitosa-card {
  background: white;
  border: 2px solid #34d399;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 1.5rem;
  box-shadow: 0 4px 24px rgba(5, 150, 105, 0.12);
}

.entrega-exitosa-header {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  padding: 2rem 1.5rem;
  text-align: center;
  color: white;
}

.entrega-exitosa-check .material-symbols-outlined {
  font-size: 48px;
  display: block;
  margin-bottom: 0.5rem;
}

.entrega-exitosa-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.entrega-exitosa-header p {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.entrega-exitosa-body {
  padding: 1.5rem;
}

/* Token Display */
.token-display {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #6ee7b7;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.token-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #065f46;
  text-transform: uppercase;
  letter-spacing: 0.75px;
  margin-bottom: 0.75rem;
}

.token-label .material-symbols-outlined {
  font-size: 18px;
}

.token-value-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  border: 1px solid #a7f3d0;
}

.token-value {
  flex: 1;
  font-size: 2rem;
  font-weight: 800;
  color: #059669;
  letter-spacing: 6px;
  font-family: 'Courier New', monospace;
}

.btn-copy-token {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid #34d399;
  background: white;
  color: #059669;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 0.8rem;
}

.btn-copy-token:hover {
  background: #059669;
  color: white;
  border-color: #059669;
}

.btn-copy-token.copied {
  background: #059669;
  color: white;
  border-color: #059669;
}

.btn-copy-token .material-symbols-outlined {
  font-size: 18px;
}

.btn-copy-label {
  font-size: 0.8rem;
}

/* Detalle grid */
.entrega-detalle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.entrega-detalle-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.entrega-detalle-item > .material-symbols-outlined {
  font-size: 20px;
  color: #6366f1;
  margin-top: 2px;
  flex-shrink: 0;
}

.detalle-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detalle-value {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 2px;
}

.entrega-exitosa-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

/* Resumen pre-verificación */
.resumen-final {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.resumen-final-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.resumen-final-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.resumen-icon {
  font-size: 22px;
  color: #6366f1;
}

.resumen-final-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.resumen-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resumen-item-icon {
  font-size: 18px;
  color: #94a3b8;
  flex-shrink: 0;
}

.resumen-label {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.resumen-value {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.input-fecha-visita {
  margin-top: 2px;
  padding: 4px 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #f8fafc;
  cursor: pointer;
}

.input-fecha-visita:focus {
  outline: none;
  border-color: #3b82f6;
  background: #fff;
}

@media (max-width: 640px) {
  .entrega-detalle-grid,
  .resumen-final-grid {
    grid-template-columns: 1fr;
  }
  .token-value {
    font-size: 1.5rem;
    letter-spacing: 4px;
  }
}

.result-card.info {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

/* Token Display */
.token-display {
  margin: 1.5rem 0 1rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 3px solid #10b981;
  text-align: center;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

.token-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.token-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #10b981;
  font-family: 'Courier New', monospace;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(16, 185, 129, 0.2);
}

.entrega-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(16, 185, 129, 0.2);
  text-align: left;
}

.entrega-details p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #065f46;
}

/* Animations */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Toggle modo búsqueda */
.modo-busqueda-toggle {
  display: flex;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.modo-btn {
  flex: 1;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.modo-btn:first-child {
  border-right: 1.5px solid #d1d5db;
}

.modo-btn.active {
  background: #3b82f6;
  color: #fff;
}

/* Selector de múltiples cuentas */
.clientes-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  max-height: 420px;
  overflow-y: auto;
}

.cliente-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem 1rem;
  border: 1.5px solid #bfdbfe;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}

.cliente-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.cliente-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cliente-cod {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e40af;
}

.cliente-reparto {
  font-size: 0.8rem;
  color: #6b7280;
  background: #e5e7eb;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
}

.cliente-item-dir {
  font-size: 0.9rem;
  color: #111827;
  font-weight: 500;
}

.cliente-item-visita {
  font-size: 0.8rem;
  color: #6b7280;
}
</style>
