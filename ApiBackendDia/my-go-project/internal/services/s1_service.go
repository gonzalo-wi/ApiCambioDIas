package services

import (
	"encoding/json"
	"fmt"
	"io"
	"my-go-project/internal/models"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const (
	S1_API_BASE   = "https://api.analytics.va.s1g.in/api/public"
	S1_PUBLIC_KEY = "ivess.38ef4216339c1a0fbc5937876e6470303e7d2ee7"
)

var (
	cachedToken        string
	tokenExpiryTime    time.Time
	tokenCacheDuration = 23 * time.Hour
)

// GetS1Token obtiene el token de S1 Analytics (con caché de 23 horas)
func GetS1Token() (string, error) {
	// Si hay token cacheado y no expiró, devolverlo
	if cachedToken != "" && time.Now().Before(tokenExpiryTime) {
		fmt.Println("📌 Usando token S1 cacheado")
		return cachedToken, nil
	}

	fmt.Println("🔑 Solicitando nuevo token S1...")

	// Preparar datos del formulario
	data := url.Values{}
	data.Set("key", S1_PUBLIC_KEY)

	// Crear request POST
	req, err := http.NewRequest("POST", S1_API_BASE+"/token/", strings.NewReader(data.Encode()))
	if err != nil {
		return "", fmt.Errorf("error creando request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Ejecutar request
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error obteniendo token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	// Parsear respuesta
	var tokenResp models.S1TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", fmt.Errorf("error parseando respuesta: %w", err)
	}

	if !tokenResp.Success || tokenResp.Data.Token == "" {
		return "", fmt.Errorf("token no obtenido, success=%v", tokenResp.Success)
	}

	// Cachear token
	cachedToken = tokenResp.Data.Token
	tokenExpiryTime = time.Now().Add(tokenCacheDuration)

	fmt.Println("✅ Token S1 obtenido y cacheado")
	return cachedToken, nil
}

// GetS1Messages obtiene mensajes de S1 Analytics
func GetS1Messages(filter models.S1MessageFilter) ([]models.S1Message, error) {
	// Obtener token
	token, err := GetS1Token()
	if err != nil {
		return nil, fmt.Errorf("error obteniendo token: %w", err)
	}

	// Valores por defecto
	if filter.Offset < 0 {
		filter.Offset = 0
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 100
	}

	// Construir URL con parámetros
	params := url.Values{}
	params.Set("type", "messages_detail")
	params.Set("date_from", filter.DateFrom)
	params.Set("date_to", filter.DateTo)
	params.Set("offset", fmt.Sprintf("%d", filter.Offset))
	params.Set("page_size", fmt.Sprintf("%d", filter.PageSize))

	apiURL := fmt.Sprintf("%s/get/?%s", S1_API_BASE, params.Encode())
	fmt.Printf("📊 Consultando mensajes S1: %s\n", apiURL)

	// Crear request GET
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error creando request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)

	// Ejecutar request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error consultando mensajes: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	// Parsear respuesta
	var messagesResp models.S1MessagesResponse
	if err := json.NewDecoder(resp.Body).Decode(&messagesResp); err != nil {
		return nil, fmt.Errorf("error parseando respuesta: %w", err)
	}

	if !messagesResp.Success {
		return nil, fmt.Errorf("respuesta no exitosa")
	}

	// Filtrar por campaign_name si se especificó
	filteredMessages := messagesResp.Data
	if filter.CampaignName != "" {
		var filtered []models.S1Message
		for _, msg := range messagesResp.Data {
			if msg.CampaignName == filter.CampaignName {
				filtered = append(filtered, msg)
			}
		}
		filteredMessages = filtered
	}

	// Filtrar por teléfono si se especificó (busca en fromacc_account)
	if filter.Phone != "" {
		var filtered []models.S1Message
		for _, msg := range filteredMessages {
			// Buscar en el número de cuenta del remitente (puede contener el teléfono)
			if strings.Contains(msg.FromAccAccount, filter.Phone) {
				filtered = append(filtered, msg)
			}
		}
		filteredMessages = filtered
	}

	fmt.Printf("✅ Mensajes obtenidos: %d (filtrados: %d)\n", len(messagesResp.Data), len(filteredMessages))
	return filteredMessages, nil
}

// GetS1Attachments obtiene attachments (imágenes/archivos) de S1 Analytics
func GetS1Attachments(filter models.S1AttachmentFilter) ([]models.S1Attachment, error) {
	// Obtener token
	token, err := GetS1Token()
	if err != nil {
		return nil, fmt.Errorf("error obteniendo token: %w", err)
	}

	// Valores por defecto
	if filter.Offset < 0 {
		filter.Offset = 0
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 100
	}

	// Construir URL con parámetros
	params := url.Values{}
	params.Set("type", "attachments_detail")
	params.Set("date_from", filter.DateFrom)
	params.Set("date_to", filter.DateTo)
	params.Set("offset", fmt.Sprintf("%d", filter.Offset))
	params.Set("page_size", fmt.Sprintf("%d", filter.PageSize))

	apiURL := fmt.Sprintf("%s/get/?%s", S1_API_BASE, params.Encode())
	fmt.Printf("📎 Consultando attachments S1: %s\n", apiURL)

	// Crear request GET
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error creando request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)

	// Ejecutar request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error consultando attachments: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	// Parsear respuesta
	var attachmentsResp models.S1AttachmentsResponse
	if err := json.NewDecoder(resp.Body).Decode(&attachmentsResp); err != nil {
		return nil, fmt.Errorf("error parseando respuesta: %w", err)
	}

	if !attachmentsResp.Success {
		return nil, fmt.Errorf("respuesta no exitosa")
	}

	// Filtrar por case_id si se especificó
	filteredAttachments := attachmentsResp.Data
	if filter.CaseID != "" {
		var filtered []models.S1Attachment
		for _, att := range attachmentsResp.Data {
			if att.CaseID == filter.CaseID {
				filtered = append(filtered, att)
			}
		}
		filteredAttachments = filtered
	}

	fmt.Printf("✅ Attachments obtenidos: %d (filtrados: %d)\n", len(attachmentsResp.Data), len(filteredAttachments))
	return filteredAttachments, nil
}

// InvalidateS1Token invalida el token cacheado (útil si hay error 401)
func InvalidateS1Token() {
	cachedToken = ""
	tokenExpiryTime = time.Time{}
	fmt.Println("🔄 Token S1 invalidado")
}
