# 📐 Arquitectura del Proyecto

## 🏗️ Estructura de Carpetas

```
src/
├── config/              # Configuración centralizada
│   └── api.config.js    # Endpoints, URLs, headers, API keys
│
├── services/            # Capa de servicios (API calls)
│   ├── api.client.js    # Cliente HTTP centralizado
│   ├── tokenService.js  # Servicio de tokens dispensador
│   ├── jaulaService.js  # Servicio de disponibilidad jaulas
│   └── siisaService.js  # Servicio consultas SIISA
│
├── composables/         # Lógica reutilizable Vue
│   └── useApi.js        # Composable para estados API (loading/error/data)
│
├── utils/               # Funciones de utilidad
│   ├── formatters.js    # Formateo de moneda, fechas, CUIL, etc.
│   ├── validators.js    # Validaciones de formularios
│   ├── errorHandler.js  # Manejo centralizado de errores
│   └── index.js         # Exportación y utilidades generales
│
├── constants/           # Constantes de la aplicación
│   └── index.js         # Rutas, códigos HTTP, mensajes, etc.
│
├── components/          # Componentes Vue
│   ├── MainLayout.vue
│   ├── Sidebar.vue
│   └── ...
│
├── views/               # Vistas/páginas
│   ├── GenerarTokenView.vue
│   ├── JaulaView.vue
│   ├── SiisaView.vue
│   └── ...
│
└── router/              # Configuración de rutas
    └── index.js
```

## 🎯 Principios de Diseño

### 1. **Separación de Responsabilidades**
- **Config**: Toda la configuración en un solo lugar
- **Services**: Comunicación con APIs
- **Composables**: Lógica de negocio reutilizable
- **Utils**: Funciones puras y helpers
- **Components/Views**: Solo presentación y UI

### 2. **DRY (Don't Repeat Yourself)**
- Cliente HTTP único (`api.client.js`) para todas las llamadas
- Composables para evitar repetir lógica de loading/error
- Constantes centralizadas (no magic strings/numbers)

### 3. **Configuración sobre Código**
```javascript
// ❌ Antes: Hardcoded
const response = await fetch('http://192.168.0.250:3002/api/token')

// ✅ Ahora: Configurado
const response = await apiClient.get(API_CONFIG.ENDPOINTS.TOKEN)
```

### 4. **Composición sobre Herencia**
```javascript
// ✅ Uso de composables
const { data, loading, error, execute } = useApi(tokenService.getToken)
```

## 🔧 Componentes Clave

### 📡 API Client (`api.client.js`)
Cliente HTTP centralizado con:
- ✅ Manejo automático de errores
- ✅ Timeout configurable (15s default)
- ✅ AbortController para cancelar requests
- ✅ Query string builder
- ✅ Content-type detection
- ✅ Métodos REST: GET, POST, PUT, DELETE, PATCH

**Uso:**
```javascript
import { apiClient } from '@/services/api.client'

// GET con query params
const data = await apiClient.get('/users', { page: 1, limit: 10 })

// POST con body
const result = await apiClient.post('/users', { name: 'John' })

// Custom timeout
const response = await apiClient.get('/slow-endpoint', {}, { timeout: 30000 })
```

### 🎣 useApi Composable
Gestiona estados de API reactivamente:
- `data`: Resultado de la llamada
- `loading`: Estado de carga
- `error`: Errores capturados
- `execute()`: Ejecuta la llamada
- `reset()`: Limpia estados

**Uso:**
```javascript
import { useApi } from '@/composables/useApi'
import { TokenService } from '@/services/tokenService'

// En componente Vue
const { data: token, loading, error, execute } = useApi(TokenService.getToken)

// Ejecutar
await execute()

// Auto-ejecución
const { data } = useApiAuto(fetchUsers, { immediate: true })
```

### ⚙️ Configuración (`api.config.js`)
Centraliza toda la configuración de APIs:
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 15000,
  ENDPOINTS: {
    TOKEN: '/api/token',
    JAULA: '/api/jaula',
    // ...
  },
  API_KEYS: {
    SIISA: import.meta.env.VITE_SIISA_API_KEY
  }
}
```

### 🛡️ Error Handling
Manejo centralizado de errores:
```javascript
import { handleError, getErrorMessage } from '@/utils/errorHandler'

try {
  await apiCall()
} catch (error) {
  const { message, code } = handleError(error, {
    context: 'Token Generation',
    showNotification: true
  })
}
```

### ✅ Validaciones
Validadores reutilizables:
```javascript
import { validators, validateForm } from '@/utils/validators'

const rules = {
  email: [validators.required(), validators.email()],
  cuil: [validators.required(), validators.cuil()],
  phone: [validators.phone()]
}

const { isValid, errors } = validateForm(formData, rules)
```

### 🎨 Formatters
Formateo consistente:
```javascript
import { formatCurrency, formatDate, formatCUIL } from '@/utils/formatters'

const precio = formatCurrency(15000) // "$15.000,00"
const fecha = formatDate('2025-01-15') // "15/01/2025"
const cuil = formatCUIL('20123456789') // "20-12345678-9"
```

## 🌍 Variables de Entorno

### Desarrollo (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3002
VITE_SIISA_API_KEY=tu_api_key_aqui
VITE_TOKEN_API_URL=http://localhost:8081
VITE_ENV=development
VITE_DEBUG=true
```

### Producción (`.env.production`)
```env
VITE_API_BASE_URL=http://192.168.0.250:3002
VITE_SIISA_API_KEY=production_api_key
VITE_TOKEN_API_URL=http://192.168.0.250:8081
VITE_ENV=production
VITE_DEBUG=false
```

**Acceso en código:**
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## 📦 Servicios

### TokenService
```javascript
import { TokenService } from '@/services/tokenService'

const { token } = await TokenService.getToken()
```

### JaulaService
```javascript
import { consultarDisponibilidadJaula } from '@/services/jaulaService'

const disponibilidad = await consultarDisponibilidadJaula(idReparto)
```

### SiisaService
```javascript
import { SiisaService } from '@/services/siisaService'

// Consultar persona
const datos = await SiisaService.consultarPersona('12345678', 'M')

// Procesar semáforo
const semaforo = SiisaService.procesarSemaforo(datos.semaforo)
```

## 🔄 Flujo de Datos

```
┌─────────────┐
│   View      │  (Presentación)
│  Component  │
└──────┬──────┘
       │
       │ usa composable
       ▼
┌─────────────┐
│  useApi()   │  (Estado reactivo)
│ Composable  │
└──────┬──────┘
       │
       │ llama servicio
       ▼
┌─────────────┐
│  Service    │  (Lógica de negocio)
│  Layer      │
└──────┬──────┘
       │
       │ usa cliente HTTP
       ▼
┌─────────────┐
│ API Client  │  (Comunicación HTTP)
│   + Config  │
└──────┬──────┘
       │
       │ request
       ▼
┌─────────────┐
│  Backend    │
│    API      │
└─────────────┘
```

## 🚀 Mejores Prácticas

### ✅ DO (Hacer)
```javascript
// ✅ Usar constantes
import { ROUTES } from '@/constants'
router.push(ROUTES.PANEL.JAULA)

// ✅ Usar composables
const { data, loading, execute } = useApi(fetchData)

// ✅ Usar utils
const formatted = formatCurrency(price)

// ✅ Centralizar configuración
apiClient.get(API_CONFIG.ENDPOINTS.TOKEN)
```

### ❌ DON'T (Evitar)
```javascript
// ❌ Magic strings
router.push('/panel/jaula')

// ❌ Lógica duplicada
const loading = ref(false)
const error = ref(null)
try {
  loading.value = true
  // ...
} catch (e) {
  error.value = e
}

// ❌ Hardcoded URLs
fetch('http://localhost:3002/api/token')

// ❌ Formateo inline
`$${amount.toFixed(2)}`
```

## 🔐 Seguridad

1. **No commitear** archivos `.env` con datos sensibles
2. Usar **`.env.example`** como template
3. API Keys en **variables de entorno**
4. Validar datos del **cliente Y servidor**

## 🧪 Testing (Futuro)

```javascript
// Estructura propuesta
src/
├── __tests__/
│   ├── unit/
│   │   ├── utils/
│   │   ├── services/
│   │   └── composables/
│   └── integration/
│       └── api/
```

## 📚 Recursos Adicionales

- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

---

**Última actualización:** Enero 2025  
**Mantenido por:** Equipo de Desarrollo El Jumillano
