package model

import (
	"context"
	"encoding/json"

	"github.com/docker/docker/client"
	"github.com/gofiber/fiber/v2"
)

type ResponseData struct {
	Status  int         `json:"status"`
	Message interface{} `json:"message"`
}
type AppPathConfig struct {
	ProjectPath string
}
type App struct {
	DockerCLI  *client.Client
	AppCtx     context.Context
	PathConfig AppPathConfig
}

func (app *App) ResponseHandler(ctx *fiber.Ctx, status int, data interface{}) error {

	responseData := ResponseData{
		Status:  status,
		Message: data,
	}
	jsonData, err := json.Marshal(responseData)

	if err != nil {
		return ctx.SendString("Parse json error")
	}

	return ctx.Send(jsonData)
}
