package app

import (
	"context"
	"encoding/json"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
)

type ResponseData struct {
	Status  int         `json:"status"`
	Message interface{} `json:"message"`
}
type App struct {
	DockerCLI    *client.Client
	AppCtx       context.Context
	PathConfig   model.AppPathConfig
	HijackedPool map[string]types.HijackedResponse
	model.AppLogger
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
