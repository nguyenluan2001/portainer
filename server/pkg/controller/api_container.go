package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/docker"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
)

func (app *App) GetContainers(ctx *fiber.Ctx) error {
	containers, err := docker.GetContainerList(app.AppCtx, app.DockerCLI)
	if err != nil {
		app.ErrorLogger.Println("Get containers failed.", err)
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message: model.GetContainerResponse{
			Containers: containers,
		},
	})
}
func (app *App) GetContainerDetail(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	containerDetail, err := docker.GetContainerDetail(app.AppCtx, app.DockerCLI, containerId)

	if err != nil {
		app.ErrorLogger.Println("Get container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Get container detail failed.",
			Message:      nil,
		})
	}

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      containerDetail,
	})
}
