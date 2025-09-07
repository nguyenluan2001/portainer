package model

type Filesystem struct {
	Type string `json:"type"`
	Name string `json:"name"`
	User string `json:"user"`
	Size int    `json:"size"`
	Mode string `json:"mode"`
	Prot string `json:"prot"`
	Time string `json:"time"`

	Contents []Filesystem `json:"contents"`
}
