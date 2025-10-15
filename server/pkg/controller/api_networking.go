package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/docker"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
)

func (app *App) GetNetworkList(ctx *fiber.Ctx) error {
	networks, err := docker.GetNetworkList(app.AppCtx, app.DockerCLI)
	if err != nil {
		app.ErrorLogger.Println("Get network list failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       0,
			ErrorMessage: "Get network list failed",
			Message:      "",
		})
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message: model.GetNetworkListResponse{
			Networks: networks,
		},
	})
}
