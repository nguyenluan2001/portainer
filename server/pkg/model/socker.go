package model

type RequestStream struct {
	Event   string      `json:"event"`
	Message interface{} `json:"message"`
}

type OutputResponse struct {
	Event   string `json:"event"`
	Buffers string `json:"buffers"`
}
