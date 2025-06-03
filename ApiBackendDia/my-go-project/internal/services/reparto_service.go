package services

import (
	"fmt"
	"my-go-project/internal/models"
	"os"

	"github.com/go-resty/resty/v2"
)

var client = resty.New()

func GetPropuestas(clienteID string) ([]models.Propuesta, error) {
	url := fmt.Sprintf("%s/propuestas/closercustomerdata4?codCliente=%s", os.Getenv("API_URL"), clienteID)
	token, err := ObtenerJmapToken()
	if err != nil {
		return nil, fmt.Errorf("error obteniendo token: %w", err)
	}

	var resp models.PropuestasResponse
	_, err = client.R().
		SetHeader("Authorization", token).
		SetResult(&resp).
		Get(url)

	if err != nil {
		return nil, err
	}
	if !resp.Success {
		return nil, fmt.Errorf("la API devolvió success=false")
	}
	return resp.ListaPropuestas, nil
}

func CambiarVisita(req models.CambioVisitaRequest) error {
	fmt.Printf("Datos recibidos para cambiar visita: nroCta=%d, cdRuta=%s, orden=%d\n", req.NroCta, req.CdRuta, req.Orden)

	url := fmt.Sprintf("%s/pedidos/insertar_orden_ruta?nroCta=%d&cdRuta=%s&orden=%d",
		os.Getenv("API_URL"),
		req.NroCta,
		req.CdRuta,
		req.Orden,
	)
	token, err := ObtenerJmapToken()
	if err != nil {
		return fmt.Errorf("error obteniendo token: %w", err)
	}

	resp, err := client.R().
		SetHeader("Authorization", token).
		Get(url)
	if err != nil {
		return err
	}

	fmt.Println("Respuesta de la API insertar_orden_ruta:", resp.String())

	if resp.StatusCode() != 200 {
		return fmt.Errorf("la API devolvió status %d: %s", resp.StatusCode(), resp.String())
	}

	return nil
}

/*
 func InformarRepartidor(nroCta int, idReparto string, mensaje string, fechaVisita string) error {
	urlApi := fmt.Sprintf("%s/pedidos/insertar-pedido?nroCta=%d&idReparto=%s&desc=%s&usuario=Jumi&horaDesde=00:00&horaHasta=23:00&fechaActual=%s&idTipoLlamada=19&idMotivoLlamada=109&idAccionLlamada=57",
		os.Getenv("API_URL"),
		nroCta,
		idReparto,
		url.QueryEscape(mensaje), // <-- importante
		fechaVisita,
	)
	token, err := ObtenerJmapToken()
	if err != nil {
		return fmt.Errorf("error obteniendo token: %w", err)
	}

	resp, err := client.R().
		SetHeader("Authorization", token).
		Get(urlApi)
	if err != nil {
		return err
	}

	fmt.Println("Respuesta de la API insertar-pedido:", resp.String())

	if resp.StatusCode() != 200 {
		return fmt.Errorf("la API devolvió status %d: %s", resp.StatusCode(), resp.String())
	}
	return nil
}

*/
