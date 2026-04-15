# Cambio Día Frontend (Vue 3 + Vite)

Aplicación frontend para las consultas de Jaula, SIISA y mensajería WhatsApp (Infobip Moments) dentro del ecosistema El Jumillano.

## Entornos

Variables principales:

```
VITE_API_BASE_URL=http://localhost:3001   # Proxy local (dev)
VITE_EL_JUMILLANO_API=http://ho.el-jumillano.com.ar:24937/api
VITE_SIISA_API_KEY=JUMI_...
```

Producción (contenedor): la app consume el proxy publicado en `http://192.168.0.250:3002` (según nginx / compose).

## Servicios Integrados

| Servicio | Endpoint interno | Descripción |
|----------|------------------|-------------|
| Attachments S1 | `/api/attachments` | Descarga y filtra adjuntos (pdf / imagen). |
| Jaula | `/api/aguas/disponibilidad-jaula` | Disponibilidad de camiones. |
| SIISA Token | `/api/token/get-token` | Obtención de token central de deudores. |
| SIISA Consulta | `/api/sissa/documento/get-situacion-full` | Situación financiera completa. |
| WhatsApp Participants | `/api/whatsapp/participants` | Envío de participantes a Flow de Infobip Moments. |

## WhatsApp (Infobip Moments)

Se agrega un endpoint en el proxy que envía participantes a un Flow específico:

`POST /api/whatsapp/participants`

Body ejemplo (sin nombre):
```json
{
	"participants": [
		{ "channels": { "whatsapp": { "phoneNumber": "5491112345678" } } }
	]
}
```

Body ejemplo (con nombre):
```json
{
	"participants": [
		{
			"channels": { "whatsapp": { "phoneNumber": "5491112345678" } },
			"person": { "firstName": "Juan" }
		}
	]
}
```

En desarrollo se usa `WhatsappService.sendParticipant({ phone, firstName })`.

### Configuración Proxy (docker-compose)

Dentro de `docker-compose.yml`:
```
environment:
	INFOBIP_BASE: "https://89ydp1.api.infobip.com"
	INFOBIP_FLOW_ID: "200000035823248"
	INFOBIP_AUTH: "<TOKEN_SIN_PREFIJO_APP>"
```
El servidor añade automáticamente el prefijo `App`.

## Desarrollo Local

1. Levantar proxy / backend / frontend: `docker compose up --build` (o correr proxy en Node y `npm run dev` para Vite).
2. Verificar `.env.development` apunta a `http://localhost:3001`.
3. Hard refresh en el navegador tras cambios mayores (Ctrl+F5).

## Próximos Pasos

- Envío masivo CSV para WhatsApp (parse y batching).
- Manejo de estados de entrega / tracking.
- Tests unitarios de normalización SIISA.

## Scripts estándar

Instalación dependencias:
```
npm install
```

Dev:
```
npm run dev
```

Build producción:
```
npm run build
```

Preview build:
```
npm run preview
```

---
Documentación base de Vue:
[Script setup](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) | [Tooling Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support)
