# My Go Project

## Overview
This project is a Go application that demonstrates a basic structure for organizing Go code. It includes an entry point, internal packages, and utility functions.

## Project Structure
```
my-go-project
├── cmd
│   └── main.go          # Entry point of the application
├── internal
│   └── example
│       └── example.go   # Internal package implementation
├── pkg
│   └── utils
│       └── utils.go     # Utility functions
├── go.mod               # Module definition
├── go.sum               # Module dependency checksums
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites
- Go 1.16 or later

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-go-project
   ```
3. Install dependencies:
   ```
   go mod tidy
   ```

### Running the Application
To run the application, execute the following command:
```
go run cmd/main.go
```

### Usage
- The application starts by executing the `main` function in `cmd/main.go`.
- Internal logic can be found in the `internal/example` package.
- Utility functions are available in the `pkg/utils` package.

## API Endpoints

### S1 Analytics - Mensajes

> 🔐 **Autenticación Automática:** El token de S1 se obtiene y cachea automáticamente por 23 horas. No necesitas hacer ninguna llamada adicional para autenticarte.

#### Obtener mensajes filtrados

**GET** `/api/s1/messages`

Busca mensajes por campaña, número de teléfono, o ambos.

```bash
# Filtrar por campaña
curl "http://localhost:8080/api/s1/messages?date_from=2024-01-01%2000:00:00&date_to=2025-01-31%2023:59:59&campaign_name=INSTALACION%20FRIO%20CALOR"

# Filtrar por número de teléfono
curl "http://localhost:8080/api/s1/messages?date_from=2024-01-01%2000:00:00&date_to=2025-12-31%2023:59:59&phone=5491161234567"

# Todos los mensajes (sin filtros)
curl "http://localhost:8080/api/s1/messages?date_from=2024-01-01%2000:00:00&date_to=2025-12-31%2023:59:59"

# Con paginación
curl "http://localhost:8080/api/s1/messages?date_from=2024-01-01%2000:00:00&date_to=2025-12-31%2023:59:59&phone=549116&offset=0&page_size=50"
```

**Parámetros Query:**
- `date_from` (requerido): Fecha inicio en formato `YYYY-MM-DD HH:MM:SS`
- `date_to` (requerido): Fecha fin en formato `YYYY-MM-DD HH:MM:SS`
- `campaign_name` (opcional): Nombre de la campaña para filtrar
- `phone` (opcional): Número de teléfono del cliente para buscar
- `offset` (opcional): Offset para paginación (default: 0)
- `page_size` (opcional): Cantidad de resultados (default: 100)

**Respuesta exitosa:**
```json
{
  "success": true,
  "total": 5,
  "data": [
    {
      "message_id": "5631595",
      "datetime": "2024-01-01 08:33:45",
      "channel": "whatsapp",
      "campaign_name": "INSTALACION FRIO CALOR",
      "content": "Hola, quiero solicitar instalación",
      "fromacc_account": "5491161234567",
      "fromacc_contact_name": "Juan Pérez",
      "case_id": "5085620",
      ...
    }
  ]
}
```

### S1 Analytics - Attachments (Imágenes/Archivos)

**GET** `/api/s1/attachments`

Obtiene las imágenes y archivos adjuntos de una conversación específica usando el `case_id`.

```bash
# Obtener todos los attachments de un case_id específico
curl "http://localhost:8080/api/s1/attachments?date_from=2020-01-01%2000:00:00&date_to=2025-12-31%2023:59:59&case_id=5085620"

# Todos los attachments (sin filtro de case_id)
curl "http://localhost:8080/api/s1/attachments?date_from=2024-01-01%2000:00:00&date_to=2025-12-31%2023:59:59"
```

**Parámetros Query:**
- `date_from` (requerido): Fecha inicio en formato `YYYY-MM-DD HH:MM:SS`
- `date_to` (requerido): Fecha fin en formato `YYYY-MM-DD HH:MM:SS`
- `case_id` (opcional): ID del caso para filtrar attachments de esa conversación
- `offset` (opcional): Offset para paginación (default: 0)
- `page_size` (opcional): Cantidad de resultados (default: 100)

**Respuesta exitosa:**
```json
{
  "success": true,
  "total": 3,
  "data": [
    {
      "att_id": "68856",
      "att_name": null,
      "att_data": "https://cdnva.s1gateway.com/file/get/...",
      "att_type": "video",
      "datetime": "2022-01-02 10:01:06",
      "message_id": "4443678",
      "note_id": null,
      "case_id": "4257895",
      "campaign_id": "622147",
      "campaign_name": "PREDICTIVAS",
      "channel": "whatsapp"
    }
  ]
}
```

**Nota:** El campo `att_data` contiene la URL completa del archivo (imagen, video, documento, etc.)

### Flujo de uso completo

**1. Buscar mensajes por teléfono del cliente:**
```bash
GET /api/s1/messages?date_from=2024-01-01 00:00:00&date_to=2025-12-31 23:59:59&phone=5491161234567
```

**2. Obtener el `case_id` del mensaje encontrado**

**3. Consultar imágenes de esa conversación:**
```bash
GET /api/s1/attachments?date_from=2020-01-01 00:00:00&date_to=2025-12-31 23:59:59&case_id=5085620
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.