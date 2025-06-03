package models

type Propuesta struct {
	NroPropuesta     int    `json:"nroPropuesta"`
	Ruta             string `json:"ruta"`
	DiaReparto       string `json:"diaReparto"`
	NombreRepartidor string `json:"nombreRepartidor"`
	NombreListaPre   string `json:"nombreListaPre"`
	HorarioPromedio  string `json:"horarioPromedio"`
	HorarioVisita    string `json:"horarioVisita"`
	OrdenRuta        int    `json:"ordenRuta"`
	Metros           int    `json:"metros"`
	Direccion        string `json:"direccion"`
	NroCta           int    `json:"nroCta"`
	IdLocalidad      int    `json:"idLocalidad"`
	IdProvincia      int    `json:"idProvincia"`
	ZonaVT           string `json:"zonaVT"`
	Localidad        string `json:"localidad"`
}

type PropuestasResponse struct {
	Success         bool        `json:"success"`
	ListaPropuestas []Propuesta `json:"listaPropuestas"`
}

type CambioVisitaRequest struct {
	NroCta int    `json:"nroCta"`
	CdRuta string `json:"cdRuta"`
	Orden  int    `json:"orden"`
}
