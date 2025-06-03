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
	err := godotenv.Load("/home/gonzalo/Documentos/Proyectos/ApiBackendDia/my-go-project/.env")
	fmt.Println("API_URL:", os.Getenv("API_URL"))
	if err != nil {
		log.Println("⚠️ No se pudo cargar el archivo .env")
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/propuestas/:clienteID", handlers.ObtenerPropuestas)
	router.POST("/cambiar-visita", handlers.CambiarVisita)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}
