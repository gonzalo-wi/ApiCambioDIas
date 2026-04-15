package models

// S1TokenResponse representa la respuesta del endpoint de token
type S1TokenResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Token string `json:"token"`
	} `json:"data"`
}

// S1Message representa un mensaje de S1 Analytics
type S1Message struct {
	MessageID          string  `json:"message_id"`
	Datetime           string  `json:"datetime"`
	Channel            string  `json:"channel"`
	IsInbound          string  `json:"is_inbound"`
	IsPrivate          string  `json:"is_private"`
	Subject            string  `json:"subject"`
	Content            string  `json:"content"`
	FromAccAccountID   string  `json:"fromacc_account_id"`
	FromAccAccount     string  `json:"fromacc_account"`
	FromAccContactName string  `json:"fromacc_contact_name"`
	ToAccAccountID     string  `json:"toacc_account_id"`
	ToAccAccount       string  `json:"toacc_account"`
	ToAccContactName   string  `json:"toacc_contact_name"`
	CaseID             string  `json:"case_id"`
	CampaignName       string  `json:"campaign_name"`
	GroupName          string  `json:"group_name"`
	UserName           *string `json:"user_name"`
}

// S1MessagesResponse representa la respuesta del endpoint de mensajes
type S1MessagesResponse struct {
	Success bool        `json:"success"`
	Data    []S1Message `json:"data"`
}

// S1MessageFilter representa los parámetros de filtro
type S1MessageFilter struct {
	DateFrom     string `form:"date_from" json:"date_from" binding:"required"`
	DateTo       string `form:"date_to" json:"date_to" binding:"required"`
	CampaignName string `form:"campaign_name" json:"campaign_name"`
	Phone        string `form:"phone" json:"phone"` // Buscar por número de teléfono
	Offset       int    `form:"offset" json:"offset"`
	PageSize     int    `form:"page_size" json:"page_size"`
}

// S1Attachment representa un adjunto de S1 Analytics
type S1Attachment struct {
	AttID        string  `json:"att_id"`
	AttName      *string `json:"att_name"`
	AttData      string  `json:"att_data"` // URL del archivo
	AttType      string  `json:"att_type"` // image, video, document, etc.
	Datetime     string  `json:"datetime"`
	MessageID    string  `json:"message_id"`
	NoteID       *string `json:"note_id"`
	CaseID       string  `json:"case_id"`
	CampaignID   string  `json:"campaign_id"`
	CampaignName string  `json:"campaign_name"`
	Channel      string  `json:"channel"`
}

// S1AttachmentsResponse representa la respuesta del endpoint de attachments
type S1AttachmentsResponse struct {
	Success bool           `json:"success"`
	Data    []S1Attachment `json:"data"`
}

// S1AttachmentFilter representa los parámetros de filtro para attachments
type S1AttachmentFilter struct {
	DateFrom string `form:"date_from" json:"date_from" binding:"required"`
	DateTo   string `form:"date_to" json:"date_to" binding:"required"`
	CaseID   string `form:"case_id" json:"case_id"` // Filtrar por case_id
	Offset   int    `form:"offset" json:"offset"`
	PageSize int    `form:"page_size" json:"page_size"`
}
