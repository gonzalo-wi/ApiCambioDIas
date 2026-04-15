package main

import (
	"fmt"
	"log"
	"my-go-project/internal/handlers"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("⚠️ No se pudo cargar el archivo .env: %v", err)
	}

	apiURL := os.Getenv("API_URL")
	fmt.Println("API_URL:", apiURL)
	if apiURL == "" {
		log.Fatal("❌ API_URL no está configurada en el archivo .env")
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/propuestas/:clienteID", handlers.ObtenerPropuestas)
	router.POST("/cambiar-visita", handlers.CambiarVisita)

	// Endpoints S1 Analytics (el token se obtiene automáticamente)
	router.GET("/api/s1/messages", handlers.GetS1Messages)
	router.GET("/api/s1/attachments", handlers.GetS1Attachments)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}
