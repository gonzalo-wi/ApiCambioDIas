package main

import (
	"encoding/json"
	"fmt"
	"log"
	"my-go-project/internal/models"
	"my-go-project/internal/services"
)

func main() {
	fmt.Println("=== Test S1 Analytics ===\n")

	// 1. Obtener token
	fmt.Println("1️⃣ Obteniendo token S1...")
	token, err := services.GetS1Token()
	if err != nil {
		log.Fatalf("❌ Error: %v", err)
	}
	tokenPreview := token
	if len(token) > 30 {
		tokenPreview = token[:30] + "..."
	}
	fmt.Printf("✅ Token obtenido: %s\n\n", tokenPreview)

	// 2. Obtener mensajes filtrados
	fmt.Println("2️⃣ Obteniendo mensajes de campaña 'INSTALACION FRIO CALOR'...")
	filter := models.S1MessageFilter{
		DateFrom:     "2024-01-01 00:00:00",
		DateTo:       "2025-01-31 23:59:59",
		CampaignName: "INSTALACION FRIO CALOR",
		Offset:       0,
		PageSize:     100, // Aumentamos para encontrar más mensajes
	}

	messages, err := services.GetS1Messages(filter)
	if err != nil {
		log.Fatalf("❌ Error: %v", err)
	}

	fmt.Printf("✅ Total de mensajes obtenidos: %d\n\n", len(messages))

	// 3. Mostrar todos los mensajes filtrados
	if len(messages) > 0 {
		fmt.Println("📋 Mensajes de 'INSTALACION FRIO CALOR':")

		for i, msg := range messages {
			jsonData, _ := json.MarshalIndent(msg, "", "  ")
			fmt.Printf("\nMensaje %d:\n%s\n", i+1, string(jsonData))
		}
	} else {
		fmt.Println("⚠️ No se encontraron mensajes para esta campaña")
	}

	fmt.Println("\n=== Test completado ===")
}
