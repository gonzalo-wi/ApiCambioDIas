<template>
  <div class="mp">

    <!-- ══ HEADER ════════════════════════════════════════════════════ -->
    <header class="hdr">
      <div class="hdr-noise"></div>
      <div class="hdr-inner">
        <div class="hdr-left">
          <nav class="breadcrumb">
            <span>Cobranza</span>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
            <span class="bc-active">Mora de Clientes</span>
          </nav>
          <div class="hdr-title-row">
            <div class="hdr-icon">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-36.5-60T536-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 55T500-300q-35 0-60.5-21T410-376l-66 26q14 48 43.5 77.5T444-238v38Zm36 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-40Zm0-80q134 0 227-93t93-267q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </div>
            <div>
              <h1>Mora de Clientes</h1>
              <p>Cuenta corriente con deuda pendiente · Gestión de cobranza</p>
            </div>
          </div>
        </div>
        <div class="hdr-right">
          <transition name="fade">
            <button v-if="consultado && clientes.length" class="btn-export" @click="exportar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Exportar CSV
            </button>
          </transition>
        </div>
      </div>
    </header>

    <main class="body">

      <!-- ══ KPI STRIP ═════════════════════════════════════════════ -->
      <transition name="kpi-drop">
        <div v-if="!cargando && clientes.length" class="kpi-strip">
          <div class="kpi-card">
            <div class="kpi-ico kpi-ico-blue">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Registros</span>
              <span class="kpi-val">{{ clientes.length }}</span>
              <span class="kpi-sub">en esta página</span>
            </div>
          </div>
          <div class="kpi-sep"></div>
          <div class="kpi-card">
            <div class="kpi-ico kpi-ico-red">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-36.5-60T536-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 55T500-300q-35 0-60.5-21T410-376l-66 26q14 48 43.5 77.5T444-238v38Zm36 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-40Zm0-80q134 0 227-93t93-267q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Deuda total</span>
              <span class="kpi-val kv-red">$ {{ formatMoney(totalDeuda) }}</span>
              <span class="kpi-sub">saldo pendiente</span>
            </div>
          </div>
          <div class="kpi-sep"></div>
          <div class="kpi-card">
            <div class="kpi-ico kpi-ico-amber">
              <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Mora promedio</span>
              <span class="kpi-val kv-amber">{{ promDias }}<em>d</em></span>
              <span class="kpi-sub">días de atraso</span>
            </div>
          </div>
          <div v-if="clientesCriticos > 0" class="kpi-sep"></div>
          <div v-if="clientesCriticos > 0" class="kpi-card kpi-card-alert">
            <div class="kpi-ico kpi-ico-crit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Críticos +90d</span>
              <span class="kpi-val kv-crit">{{ clientesCriticos }}</span>
              <span class="kpi-sub">atención urgente</span>
            </div>
          </div>
        </div>
      </transition>

      <!-- ══ FILTROS ════════════════════════════════════════════════ -->
      <div class="filter-card" :class="{ collapsed: !filtroAbierto }">
        <button class="filter-toggle" @click="filtroAbierto = !filtroAbierto">
          <div class="ft-left">
            <svg viewBox="0 -960 960 960" fill="currentColor" width="15" height="15"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg>
            <span>Filtros de búsqueda</span>
            <transition name="fade">
              <div v-if="!filtroAbierto" class="ft-summary">
                <span class="fs-pill">{{ estadoLabel }}</span>
                <span class="fs-pill fs-pill-range">
                  {{ bucketActivo !== 'custom' ? bucketActivo : `${filtros.mora_desde}–${filtros.mora_hasta}d` }}
                </span>
              </div>
            </transition>
          </div>
          <svg class="ft-chevron" :class="{ open: filtroAbierto }" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>

        <transition name="expand">
          <div v-if="filtroAbierto" class="filter-body">
            <div class="filter-grid">
              <div class="fg-group">
                <label class="fg-label">Estado de cuenta</label>
                <div class="radio-row">
                  <button
                    v-for="opt in estadoOpts"
                    :key="opt.value"
                    class="radio-btn"
                    :class="{ active: filtros.estado === opt.value }"
                    @click="filtros.estado = opt.value"
                  >
                    <span class="rb-dot" :class="opt.dotClass"></span>
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <div class="fg-group fg-group-wide">
                <label class="fg-label">Rango de mora</label>
                <div class="bucket-row">
                  <button
                    v-for="b in buckets"
                    :key="b.label"
                    class="bkt"
                    :class="[`bkt-${b.sev}`, { active: bucketActivo === b.label }]"
                    @click="aplicarBucket(b)"
                  >{{ b.label }}</button>
                  <button
                    class="bkt bkt-custom"
                    :class="{ active: bucketActivo === 'custom' }"
                    @click="bucketActivo = 'custom'"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    Personalizado
                  </button>
                </div>

                <transition name="expand">
                  <div v-if="bucketActivo === 'custom'" class="custom-range">
                    <div class="cr-field">
                      <label>Desde</label>
                      <div class="cr-input">
                        <input v-model.number="filtros.mora_desde" type="number" min="0" placeholder="0"/>
                        <span>días</span>
                      </div>
                    </div>
                    <span class="cr-dash">—</span>
                    <div class="cr-field">
                      <label>Hasta</label>
                      <div class="cr-input">
                        <input v-model.number="filtros.mora_hasta" type="number" min="0" placeholder="9999"/>
                        <span>días</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <div class="filter-footer">
              <button class="btn-primary" :disabled="cargando" @click="buscar(1)">
                <svg v-if="!cargando" viewBox="0 -960 960 960" fill="currentColor" width="16" height="16">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
                <svg v-else class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
                </svg>
                {{ cargando ? 'Consultando…' : 'Buscar registros' }}
              </button>
              <button v-if="consultado" class="btn-ghost" @click="limpiar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Limpiar
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- ══ ERROR ══════════════════════════════════════════════════ -->
      <transition name="fade">
        <div v-if="error" class="alert-err">
          <div class="ae-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="ae-body">
            <p class="ae-title">Error al consultar</p>
            <p class="ae-msg">{{ error }}</p>
          </div>
          <button class="ae-close" @click="error = null">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      </transition>

      <!-- ══ SKELETON ═══════════════════════════════════════════════ -->
      <div v-if="cargando" class="skel-wrap">
        <div class="skel-kpis">
          <div v-for="i in 4" :key="i" class="skel-box sh" style="height:80px;border-radius:14px"></div>
        </div>
        <div class="skel-tbl">
          <div class="sh" style="height:48px;border-radius:0"></div>
          <div v-for="i in 7" :key="i" class="sh" style="height:60px;border-radius:0;border-top:1px solid #f1f5f9" :style="{ opacity: 1 - i * 0.11 }"></div>
        </div>
      </div>

      <!-- ══ RESULTADOS ═════════════════════════════════════════════ -->
      <transition name="slide-up">
        <div v-if="!cargando && clientes.length">

          <!-- Toolbar -->
          <div class="toolbar">
            <div class="search-wrap">
              <svg class="s-ico" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              </svg>
              <input v-model="busquedaLocal" class="s-input" placeholder="Filtrar por nombre, CUIT, email, cuenta…"/>
              <button v-if="busquedaLocal" class="s-clear" @click="busquedaLocal = ''">
                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="toolbar-meta">
              <span class="tm-count">
                <strong>{{ clientesFiltrados.length }}</strong> / {{ clientes.length }} registros
              </span>
              <span class="tm-page">Página {{ paginaActual }}</span>
            </div>
          </div>

          <!-- Tabla -->
          <div class="tbl-card">
            <table>
              <thead>
                <tr>
                  <th style="min-width:220px">Cliente</th>
                  <th>Cuenta</th>
                  <th>Comprobante</th>
                  <th class="th-r">Saldo original</th>
                  <th class="th-r">Saldo pendiente</th>
                  <th class="th-c">Estado</th>
                  <th class="th-c">Mora</th>
                  <th class="th-c">Bucket</th>
                  <th style="width:36px"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="c in clientesFiltrados" :key="c.id">
                  <tr
                    class="dr"
                    :class="[`sev-${sevLevel(c.dias_mora)}`, { open: expandido === c.id }]"
                    @click="toggleExpand(c.id)"
                  >
                    <td>
                      <div class="cell-name">
                        <div class="sev-bar" :class="`sb-${sevLevel(c.dias_mora)}`"></div>
                        <div>
                          <div class="cn-name">{{ c.Nombre }}</div>
                          <div class="cn-cuit">{{ c.NrCUIT?.trim() }}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="mono">{{ c.nrocta }}</span></td>
                    <td>
                      <div class="cell-comp">
                        <span class="cc-ref">{{ c.codapl }} · {{ c.nroapl }}</span>
                        <span class="cc-date">{{ c.fecha_comprobante }}</span>
                      </div>
                    </td>
                    <td class="td-r"><span class="num">$ {{ formatMoney(c.saldo_original) }}</span></td>
                    <td class="td-r"><span class="num num-debt">$ {{ formatMoney(c.saldo_pendiente) }}</span></td>
                    <td class="td-c">
                      <span :class="['status-badge', c.estado === 'PENDIENTE' ? 'sb-warn' : 'sb-ok']">
                        <i class="st-dot"></i>{{ c.estado }}
                      </span>
                    </td>
                    <td class="td-c">
                      <div :class="['mora-chip', `mc-${sevLevel(c.dias_mora)}`]">
                        <span>{{ c.dias_mora }}</span>
                        <em>días</em>
                      </div>
                    </td>
                    <td class="td-c"><span class="bkt-mono">{{ c.bucket_mora }}</span></td>
                    <td class="td-c">
                      <svg class="row-chevron" :class="{ flip: expandido === c.id }" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </td>
                  </tr>

                  <!-- Panel expandido -->
                  <tr v-if="expandido === c.id" class="detail-tr">
                    <td colspan="9">
                      <div class="det-panel">
                        <div class="det-left">
                          <p class="det-heading">Información de contacto</p>
                          <div class="det-fields">
                            <div class="det-field">
                              <div class="df-ico">
                                <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                              </div>
                              <div>
                                <span class="df-lbl">Dirección</span>
                                <span class="df-val">{{ c.Direcc || '—' }}</span>
                              </div>
                            </div>
                            <div class="det-field">
                              <div class="df-ico">
                                <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M798-120q-125 0-247-54.5T329-329Q224-434 169.5-556T115-803q0-19 13-32t32-13h140q14 0 25 9.5t14 24.5l26 114q2 14-.5 25.5T356-656l-97 98q20 37 47.5 71.5T364-421q31 31 65 57.5t72 45.5l94-95q11-11 26-15.5t29-1.5l108 24q14 3 23.5 14.5T792-365v136q0 19-13 32t-32 13Z"/></svg>
                              </div>
                              <div>
                                <span class="df-lbl">Teléfonos</span>
                                <span class="df-val">{{ c.Telefn || '—' }} · {{ c.TeMovil || '—' }}</span>
                              </div>
                            </div>
                            <div class="det-field">
                              <div class="df-ico">
                                <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                              </div>
                              <div>
                                <span class="df-lbl">Email</span>
                                <span class="df-val">{{ c.email || '—' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="det-actions">
                          <button class="da-btn da-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            Llamar
                          </button>
                          <button class="da-btn da-ghost">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            Email
                          </button>
                          <button class="da-btn da-ghost">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            Ver cuenta
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>

                <tr v-if="!clientesFiltrados.length && busquedaLocal">
                  <td colspan="9">
                    <div class="no-match">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="28" height="28">
                        <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                      </svg>
                      Sin coincidencias para "<strong>{{ busquedaLocal }}</strong>"
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="pag">
            <button class="pag-btn" :disabled="paginaActual <= 1 || cargando" @click="buscar(paginaActual - 1)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
              Anterior
            </button>
            <div class="pag-indicator">
              <span class="pag-num">{{ paginaActual }}</span>
            </div>
            <button class="pag-btn" :disabled="cargando || !hayMas" @click="buscar(paginaActual + 1)">
              Siguiente
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </button>
          </div>
        </div>
      </transition>

      <!-- ══ EMPTY ═══════════════════════════════════════════════ -->
      <transition name="fade">
        <div v-if="!cargando && consultado && !clientes.length && !error" class="empty">
          <div class="empty-ico">
            <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
          </div>
          <h3>Sin resultados</h3>
          <p>No hay clientes con los filtros seleccionados.</p>
          <button class="btn-primary" style="margin-top:1.25rem" @click="filtroAbierto = true">Ajustar filtros</button>
        </div>
      </transition>

      <!-- ══ WELCOME ═══════════════════════════════════════════════ -->
      <transition name="fade">
        <div v-if="!cargando && !consultado && !error" class="welcome">
          <div class="wlc-ico">
            <svg viewBox="0 -960 960 960" fill="currentColor"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
          </div>
          <h3>Consultá la mora de clientes</h3>
          <p>Seleccioná el estado y el rango de mora, luego presioná <strong>Buscar registros</strong>.</p>
        </div>
      </transition>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'http://192.168.0.251:8083'

const estadoOpts = [
  { label: 'Pendiente', value: 'PENDIENTE', dotClass: 'dot-warn' },
  { label: 'Pagado',    value: 'PAGADO',    dotClass: 'dot-ok'   },
  { label: 'Todos',     value: '',          dotClass: 'dot-all'  },
]

const buckets = [
  { label: '1-30d',   desde: 1,   hasta: 30,   sev: 'low'  },
  { label: '31-60d',  desde: 31,  hasta: 60,   sev: 'mid'  },
  { label: '61-90d',  desde: 61,  hasta: 90,   sev: 'high' },
  { label: '91-120d', desde: 91,  hasta: 120,  sev: 'crit' },
  { label: '+120d',   desde: 121, hasta: 9999, sev: 'crit' },
]

const filtros       = ref({ estado: 'PENDIENTE', mora_desde: 61, mora_hasta: 90, page: 1 })
const bucketActivo  = ref('61-90d')
const busquedaLocal = ref('')
const expandido     = ref(null)
const filtroAbierto = ref(true)

const clientes    = ref([])
const cargando    = ref(false)
const error       = ref(null)
const consultado  = ref(false)
const paginaActual = ref(1)
const hayMas      = ref(true)

const estadoLabel = computed(() =>
  estadoOpts.find(o => o.value === filtros.value.estado)?.label ?? 'Todos'
)

const clientesFiltrados = computed(() => {
  if (!busquedaLocal.value.trim()) return clientes.value
  const q = busquedaLocal.value.toLowerCase()
  return clientes.value.filter(c =>
    c.Nombre?.toLowerCase().includes(q) ||
    c.NrCUIT?.toLowerCase().includes(q) ||
    c.email?.toLowerCase().includes(q) ||
    String(c.nrocta ?? '').includes(q)
  )
})

const totalDeuda = computed(() =>
  clientes.value.reduce((a, c) => a + Number(c.saldo_pendiente || 0), 0)
)

const promDias = computed(() => {
  if (!clientes.value.length) return 0
  return Math.round(clientes.value.reduce((a, c) => a + Number(c.dias_mora || 0), 0) / clientes.value.length)
})

const clientesCriticos = computed(() =>
  clientes.value.filter(c => Number(c.dias_mora) > 90).length
)

function formatMoney(val) {
  return Number(val || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function sevLevel(dias) {
  const d = Number(dias)
  if (d <= 30) return 'low'
  if (d <= 60) return 'mid'
  if (d <= 90) return 'high'
  return 'crit'
}

function aplicarBucket(b) {
  bucketActivo.value = b.label
  filtros.value.mora_desde = b.desde
  filtros.value.mora_hasta = b.hasta
}

function toggleExpand(id) {
  expandido.value = expandido.value === id ? null : id
}

function limpiar() {
  clientes.value  = []
  consultado.value = false
  error.value     = null
  busquedaLocal.value = ''
  expandido.value = null
  filtroAbierto.value = true
}

function exportar() {
  const cols = ['Nombre','CUIT','Nro Cta','Aplic','Nro Aplic','Saldo Original','Saldo Pendiente','Estado','Días Mora','Bucket']
  const rows = clientes.value.map(c => [
    c.Nombre, c.NrCUIT?.trim(), c.nrocta, c.codapl, c.nroapl,
    c.saldo_original, c.saldo_pendiente, c.estado, c.dias_mora, c.bucket_mora,
  ])
  const csv = [cols, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
    download: `mora-clientes-${new Date().toISOString().slice(0,10)}.csv`,
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

async function buscar(page = filtros.value.page) {
  filtros.value.page = page
  cargando.value    = true
  error.value       = null
  clientes.value    = []
  consultado.value  = false
  busquedaLocal.value = ''
  expandido.value   = null
  filtroAbierto.value = false

  try {
    const params = {
      page: filtros.value.page,
      mora_desde: filtros.value.mora_desde,
      mora_hasta: filtros.value.mora_hasta,
    }
    if (filtros.value.estado) params.estado = filtros.value.estado

    const { data } = await axios.get(
      `${API_BASE}/api/clientes/cuenta-corriente-deuda-all`,
      { params }
    )

    if (data?.status === 'success') {
      clientes.value   = data.data?.data ?? []
      paginaActual.value = data.data?.current_page ?? page
      hayMas.value     = (data.data?.data ?? []).length > 0
    } else {
      error.value = 'La API devolvió un estado inesperado.'
    }
  } catch (err) {
    console.error('Error mora clientes:', err)
    error.value = err.response?.data?.message ?? 'No se pudo conectar con la API de clientes.'
  } finally {
    cargando.value   = false
    consultado.value = true
  }
}
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Tokens ──────────────────────────────────────────────────────── */
.mp {
  --c-bg:       #eef1f6;
  --c-card:     #ffffff;
  --c-border:   #e2e8f2;
  --c-primary:  #2563eb;
  --c-text1:    #0d1b2e;
  --c-text2:    #4e5f78;
  --c-text3:    #8fa0b8;
  --c-low:      #16a34a;
  --c-low-bg:   #f0fdf4;
  --c-mid:      #ca8a04;
  --c-mid-bg:   #fefce8;
  --c-high:     #ea580c;
  --c-high-bg:  #fff7ed;
  --c-crit:     #dc2626;
  --c-crit-bg:  #fef2f2;
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05);
  --shadow-md:  0 2px 6px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06);
  min-height: 100vh;
  background: var(--c-bg);
  font-family: inherit;
}

/* ── Header ──────────────────────────────────────────────────────── */
.hdr {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0c1e3e 0%, #1a3a7a 55%, #2563eb 100%);
  padding: 0 2.5rem;
}
.hdr-noise {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 85% -30%, rgba(255,255,255,.13) 0%, transparent 50%),
    radial-gradient(ellipse at -5% 120%, rgba(99,179,237,.12) 0%, transparent 45%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hdr-inner {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 0 1.875rem;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: rgba(255,255,255,.55);
  margin-bottom: 0.75rem;
  letter-spacing: 0.02em;
}
.breadcrumb svg { width: 14px; height: 14px; fill: rgba(255,255,255,.35); }
.bc-active { color: rgba(255,255,255,.85); font-weight: 600; }
.hdr-title-row {
  display: flex;
  align-items: center;
  gap: 1.125rem;
}
.hdr-icon {
  flex-shrink: 0;
  width: 52px; height: 52px;
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.22);
  display: flex; align-items: center; justify-content: center;
}
.hdr-icon svg { width: 28px; height: 28px; fill: white; }
.hdr-left h1 {
  font-size: 1.65rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.35px;
  line-height: 1.2;
}
.hdr-left p {
  font-size: 0.845rem;
  color: rgba(255,255,255,.65);
  margin-top: 0.2rem;
}
.hdr-right { flex-shrink: 0; padding-bottom: 0.25rem; }

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.125rem;
  background: rgba(255,255,255,.14);
  backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 9px;
  font-size: 0.845rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
}
.btn-export:hover { background: rgba(255,255,255,.24); border-color: rgba(255,255,255,.45); }

/* ── Body ────────────────────────────────────────────────────────── */
.body {
  padding: 1.75rem 2.5rem 3rem;
  max-width: 1440px;
}

/* ── KPI strip ───────────────────────────────────────────────────── */
.kpi-strip {
  display: flex;
  align-items: stretch;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.kpi-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.5rem;
}
.kpi-card-alert { background: #fff9f9; }
.kpi-sep { width: 1px; background: var(--c-border); flex-shrink: 0; margin: 0.875rem 0; }
.kpi-ico {
  flex-shrink: 0;
  width: 42px; height: 42px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-ico svg { width: 22px; height: 22px; }
.kpi-ico-blue { background: #eff6ff; }
.kpi-ico-blue svg { fill: #2563eb; }
.kpi-ico-red  { background: #fef2f2; }
.kpi-ico-red  svg { fill: #dc2626; }
.kpi-ico-amber { background: #fffbeb; }
.kpi-ico-amber svg { fill: #d97706; }
.kpi-ico-crit { background: #fff1f0; }
.kpi-ico-crit svg { stroke: #dc2626; }

.kpi-body { display: flex; flex-direction: column; gap: 0.1rem; }
.kpi-label { font-size: 0.72rem; font-weight: 700; color: var(--c-text3); text-transform: uppercase; letter-spacing: .05em; }
.kpi-val {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--c-text1);
  line-height: 1.15;
}
.kpi-val em { font-size: 0.875rem; font-style: normal; font-weight: 600; color: var(--c-text2); margin-left: 1px; }
.kpi-sub { font-size: 0.73rem; color: var(--c-text3); }
.kv-red  { color: #dc2626; }
.kv-amber { color: #b45309; }
.kv-crit { color: #b91c1c; }

/* ── Filter card ─────────────────────────────────────────────────── */
.filter-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.25rem;
  overflow: hidden;
  transition: border-color .2s;
}
.filter-card.collapsed { border-color: var(--c-border); }

.filter-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  gap: 1rem;
}
.ft-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-text1);
}
.ft-left svg { fill: var(--c-primary); flex-shrink: 0; }
.ft-summary { display: flex; gap: 0.4rem; }
.fs-pill {
  display: inline-block;
  padding: 0.18rem 0.65rem;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid #bfdbfe;
}
.fs-pill-range { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }

.ft-chevron {
  width: 22px; height: 22px;
  fill: var(--c-text3);
  transition: transform .25s;
  flex-shrink: 0;
}
.ft-chevron.open { transform: rotate(180deg); fill: var(--c-primary); }

.filter-body { padding: 0 1.5rem 1.5rem; border-top: 1px solid #f3f6fb; }
.filter-grid {
  display: flex;
  gap: 2rem;
  padding-top: 1.25rem;
  flex-wrap: wrap;
}
.fg-group { display: flex; flex-direction: column; gap: 0.6rem; }
.fg-group-wide { flex: 1; min-width: 320px; }
.fg-label { font-size: 0.75rem; font-weight: 700; color: var(--c-text2); text-transform: uppercase; letter-spacing: .05em; }

.radio-row { display: flex; gap: 0.375rem; }
.radio-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  border: 1.5px solid var(--c-border);
  background: #f8fafc;
  color: var(--c-text2);
  font-size: 0.845rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}
.radio-btn:hover { border-color: #93c5fd; color: #1e40af; background: #eff6ff; }
.radio-btn.active { background: #2563eb; border-color: #2563eb; color: white; box-shadow: 0 2px 10px rgba(37,99,235,.3); }
.rb-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-warn { background: #f59e0b; }
.dot-ok   { background: #22c55e; }
.dot-all  { background: #94a3b8; }
.radio-btn.active .rb-dot { background: rgba(255,255,255,.7); }

.bucket-row { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.bkt {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.32rem 0.75rem;
  border-radius: 999px;
  border: 1.5px solid var(--c-border);
  background: #f8fafc;
  color: var(--c-text2);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s;
}
.bkt:hover { border-color: #93c5fd; background: #eff6ff; color: #1e40af; }
.bkt.active { box-shadow: 0 1px 6px rgba(0,0,0,.12); }
.bkt-low.active  { background: var(--c-low-bg); border-color: var(--c-low); color: var(--c-low); }
.bkt-mid.active  { background: var(--c-mid-bg); border-color: var(--c-mid); color: var(--c-mid); }
.bkt-high.active { background: var(--c-high-bg); border-color: var(--c-high); color: var(--c-high); }
.bkt-crit.active { background: var(--c-crit-bg); border-color: var(--c-crit); color: var(--c-crit); }
.bkt-custom { border-style: dashed; }

.custom-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafd;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 0.875rem 1.125rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}
.cr-field { display: flex; flex-direction: column; gap: 0.25rem; }
.cr-field label { font-size: 0.72rem; font-weight: 700; color: var(--c-text2); }
.cr-input { display: flex; align-items: center; }
.cr-input input {
  width: 88px;
  padding: 0.45rem 0.6rem;
  border: 1.5px solid var(--c-border);
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 0.875rem;
  color: var(--c-text1);
  background: white;
  outline: none;
  transition: border-color .2s;
}
.cr-input input:focus { border-color: var(--c-primary); }
.cr-input span {
  padding: 0.45rem 0.6rem;
  background: #f1f5f9;
  border: 1.5px solid var(--c-border);
  border-left: none;
  border-radius: 0 8px 8px 0;
  font-size: 0.75rem;
  color: var(--c-text3);
  font-weight: 600;
}
.cr-dash { color: #cbd5e1; font-size: 1.1rem; margin-top: 1.4rem; }

.filter-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.125rem;
  border-top: 1px solid #f3f6fb;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37,99,235,.3);
  transition: all .2s;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,.4); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.65rem 1rem;
  background: none;
  color: var(--c-text2);
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}
.btn-ghost:hover { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }

/* ── Alert ───────────────────────────────────────────────────────── */
.alert-err {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  padding: 1rem 1.125rem;
  margin-bottom: 1.25rem;
}
.ae-ico { flex-shrink: 0; width: 20px; height: 20px; color: #ef4444; }
.ae-ico svg { width: 20px; height: 20px; stroke: #ef4444; }
.ae-body { flex: 1; }
.ae-title { font-weight: 700; color: #b91c1c; font-size: 0.88rem; }
.ae-msg { color: #dc2626; font-size: 0.83rem; margin-top: 0.15rem; }
.ae-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #fca5a5;
  padding: 0.125rem;
  border-radius: 4px;
  transition: color .15s;
}
.ae-close:hover { color: #b91c1c; }

/* ── Skeleton ────────────────────────────────────────────────────── */
@keyframes shim { 0% { background-position: -700px 0 } 100% { background-position: 700px 0 } }
.sh {
  background: linear-gradient(90deg, #edf1f7 25%, #dde4f0 50%, #edf1f7 75%);
  background-size: 700px 100%;
  animation: shim 1.5s infinite linear;
}
.skel-wrap { margin-bottom: 1.25rem; }
.skel-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.875rem; margin-bottom: 1rem; }
.skel-tbl { background: white; border-radius: 16px; border: 1px solid var(--c-border); overflow: hidden; }

/* ── Toolbar ─────────────────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
}
.search-wrap {
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  padding: 0 0.75rem;
  flex: 1;
  max-width: 400px;
  transition: border-color .2s;
}
.search-wrap:focus-within { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
.s-ico { width: 16px; height: 16px; fill: var(--c-text3); flex-shrink: 0; }
.s-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.575rem 0.5rem;
  font-size: 0.875rem;
  color: var(--c-text1);
  background: transparent;
}
.s-input::placeholder { color: var(--c-text3); }
.s-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-text3);
  padding: 0.125rem;
  border-radius: 4px;
  display: flex;
  transition: color .15s;
}
.s-clear:hover { color: #ef4444; }
.toolbar-meta { display: flex; align-items: center; gap: 1rem; }
.tm-count { font-size: 0.85rem; color: var(--c-text2); }
.tm-count strong { color: var(--c-text1); }
.tm-page { font-size: 0.82rem; color: var(--c-text3); background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600; }

/* ── Table ───────────────────────────────────────────────────────── */
.tbl-card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}
table { width: 100%; border-collapse: collapse; font-size: 0.855rem; }

thead tr { background: linear-gradient(90deg, #0f1f42, #1e3a8a 60%, #2563eb); }
thead th {
  padding: 0.9rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,.85);
  text-align: left;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.th-r { text-align: right; }
.th-c { text-align: center; }

.dr {
  border-bottom: 1px solid #f3f6fb;
  cursor: pointer;
  transition: background .12s;
}
.dr:hover { background: #f8faff; }
.dr.open { background: #f0f7ff; }
.dr.open + .detail-tr td { border-bottom: 2px solid #bfdbfe; }

tbody td {
  padding: 0.85rem 1rem;
  color: #374151;
  vertical-align: middle;
}
.td-r { text-align: right; }
.td-c { text-align: center; }

/* Name cell with severity bar */
.cell-name { display: flex; align-items: center; gap: 0.75rem; }
.sev-bar { width: 3px; height: 36px; border-radius: 999px; flex-shrink: 0; }
.sb-low  { background: var(--c-low);  }
.sb-mid  { background: var(--c-mid);  }
.sb-high { background: var(--c-high); }
.sb-crit { background: var(--c-crit); }

.cn-name { font-weight: 700; color: var(--c-text1); white-space: nowrap; }
.cn-cuit { font-size: 0.75rem; color: var(--c-text3); margin-top: 0.1rem; }

.cell-comp { display: flex; flex-direction: column; }
.cc-ref { font-size: 0.8rem; font-weight: 600; color: var(--c-text2); }
.cc-date { font-size: 0.73rem; color: var(--c-text3); margin-top: 0.1rem; }

.mono { font-family: 'SFMono-Regular','Courier New',monospace; font-size: 0.81rem; color: var(--c-text2); }
.num { font-family: 'SFMono-Regular','Courier New',monospace; font-weight: 600; color: #374151; white-space: nowrap; }
.num-debt { color: #b91c1c; font-weight: 700; }

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.24rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: .03em;
  white-space: nowrap;
}
.sb-warn { background: #fef3c7; color: #92400e; }
.sb-ok   { background: #dcfce7; color: #166534; }
.st-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.sb-warn .st-dot { background: #f59e0b; }
.sb-ok   .st-dot { background: #22c55e; }

/* Mora chip */
.mora-chip {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-weight: 800;
  line-height: 1;
  gap: 0.1rem;
}
.mora-chip span { font-size: 1rem; }
.mora-chip em { font-size: 0.62rem; font-style: normal; font-weight: 600; opacity: .75; }
.mc-low  { background: var(--c-low-bg);  color: var(--c-low);  }
.mc-mid  { background: var(--c-mid-bg);  color: var(--c-mid);  }
.mc-high { background: var(--c-high-bg); color: var(--c-high); }
.mc-crit { background: var(--c-crit-bg); color: var(--c-crit); }

.bkt-mono { font-family: 'SFMono-Regular','Courier New',monospace; font-size: 0.78rem; color: var(--c-text2); background: #f1f5f9; padding: 0.2rem 0.55rem; border-radius: 5px; white-space: nowrap; }

/* Chevron */
.row-chevron { width: 20px; height: 20px; fill: var(--c-text3); transition: transform .25s, fill .15s; }
.row-chevron.flip { transform: rotate(180deg); fill: var(--c-primary); }

/* Detail panel */
.detail-tr td { padding: 0; background: #f5f9ff; }
.det-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 1.25rem;
  flex-wrap: wrap;
}
.det-left { flex: 1; }
.det-heading { font-size: 0.72rem; font-weight: 700; color: var(--c-text3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 0.75rem; }
.det-fields { display: flex; gap: 1.75rem; flex-wrap: wrap; }
.det-field {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.df-ico { width: 28px; height: 28px; background: #dbeafe; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.df-ico svg { width: 14px; height: 14px; fill: var(--c-primary); }
.df-lbl { display: block; font-size: 0.7rem; font-weight: 700; color: var(--c-text3); margin-bottom: 0.1rem; text-transform: uppercase; letter-spacing: .04em; }
.df-val { display: block; font-size: 0.83rem; color: var(--c-text1); }

.det-actions { display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-start; padding-top: 1.4rem; }
.da-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.875rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.da-primary {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(37,99,235,.25);
}
.da-primary:hover { box-shadow: 0 4px 14px rgba(37,99,235,.4); transform: translateY(-1px); }
.da-ghost {
  background: white;
  color: var(--c-text2);
  border: 1.5px solid var(--c-border);
}
.da-ghost:hover { border-color: #93c5fd; color: #1e40af; background: #eff6ff; }

/* No match */
.no-match {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.25rem;
  color: var(--c-text3);
  font-size: 0.875rem;
}
.no-match svg { stroke: var(--c-text3); flex-shrink: 0; }
.no-match strong { color: var(--c-text2); }

/* ── Pagination ──────────────────────────────────────────────────── */
.pag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.pag-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.125rem;
  border: 1.5px solid var(--c-border);
  background: white;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text2);
  cursor: pointer;
  transition: all .15s;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
}
.pag-btn:hover:not(:disabled) { border-color: var(--c-primary); color: #1e40af; background: #eff6ff; }
.pag-btn:disabled { opacity: .35; cursor: not-allowed; }
.pag-indicator { display: flex; align-items: center; }
.pag-num {
  min-width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: var(--c-primary);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
}

/* ── Empty / Welcome ─────────────────────────────────────────────── */
.empty, .welcome {
  text-align: center;
  padding: 4.5rem 2rem;
}
.empty-ico, .wlc-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 76px; height: 76px;
  border-radius: 50%;
  margin-bottom: 1.25rem;
}
.empty-ico { background: #f1f5f9; }
.empty-ico svg { width: 38px; height: 38px; fill: var(--c-text3); }
.wlc-ico { background: #eff6ff; }
.wlc-ico svg { width: 38px; height: 38px; fill: var(--c-primary); }
.empty h3, .welcome h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-text1); margin-bottom: 0.4rem; }
.empty p, .welcome p { font-size: 0.9rem; color: var(--c-text2); }
.welcome p strong { color: var(--c-text1); }

/* ── Transitions ─────────────────────────────────────────────────── */
@keyframes spin { to { transform: rotate(360deg) } }
.spin { animation: spin .9s linear infinite; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.kpi-drop-enter-active { transition: all .4s cubic-bezier(.22,1,.36,1); }
.kpi-drop-enter-from { opacity: 0; transform: translateY(-12px); }

.slide-up-enter-active { transition: all .35s cubic-bezier(.22,1,.36,1); }
.slide-up-enter-from { opacity: 0; transform: translateY(18px); }

.expand-enter-active, .expand-leave-active { transition: all .28s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { max-height: 400px; }
</style>
