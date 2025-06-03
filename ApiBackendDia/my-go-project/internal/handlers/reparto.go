package handlers

import (
	"fmt"
	"net/http"
	"my-go-project/internal/services"
    "my-go-project/internal/models"
	"github.com/gin-gonic/gin"
)

func ObtenerPropuestas(c *gin.Context) {
    clienteID := c.Param("clienteID")
    propuestas, err := services.GetPropuestas(clienteID)
    if err != nil {
        fmt.Println("Error en GetPropuestas:", err) // <-- agrega este log
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener propuestas"})
        return
    }
    c.JSON(http.StatusOK, propuestas)
}

func CambiarVisita(c *gin.Context) {
	var req models.CambioVisitaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Formato inválido"})
		return
	}

	err := services.CambiarVisita(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo cambiar la visita"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Visita actualizada correctamente"})
}
