package handlers

import (
	"my-go-project/internal/models"
	"my-go-project/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetS1Messages maneja las peticiones para obtener mensajes de S1
// El token se obtiene y cachea automáticamente por 23 horas
// GET /api/s1/messages?date_from=2024-01-01 00:00:00&date_to=2025-01-31 23:59:59&campaign_name=INSTALACION FRIO CALOR
// GET /api/s1/messages?date_from=2024-01-01 00:00:00&date_to=2025-01-31 23:59:59&phone=5491161234567
func GetS1Messages(c *gin.Context) {
	var filter models.S1MessageFilter

	// Parsear parámetros query
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Parámetros inválidos",
			"details": err.Error(),
		})
		return
	}

	// Obtener mensajes (el token se maneja automáticamente en el servicio)
	messages, err := services.GetS1Messages(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error obteniendo mensajes de S1",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(messages),
		"data":    messages,
	})
}

// GetS1Attachments maneja las peticiones para obtener attachments de S1
// El token se obtiene y cachea automáticamente por 23 horas
// GET /api/s1/attachments?date_from=2020-01-01 00:00:00&date_to=2025-01-31 23:59:59&case_id=5085619
func GetS1Attachments(c *gin.Context) {
	var filter models.S1AttachmentFilter

	// Parsear parámetros query
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Parámetros inválidos",
			"details": err.Error(),
		})
		return
	}

	// Obtener attachments (el token se maneja automáticamente en el servicio)
	attachments, err := services.GetS1Attachments(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error obteniendo attachments de S1",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(attachments),
		"data":    attachments,
	})
}
