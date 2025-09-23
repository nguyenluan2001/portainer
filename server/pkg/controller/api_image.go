package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/docker"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
)

func (app *App) GetImageList(ctx *fiber.Ctx) error {
	images, err := docker.GetImageList(app.AppCtx, app.DockerCLI)
	if err != nil {
		app.ErrorLogger.Println("Get containers failed.", err)
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message: model.GetImageResponse{
			Images: images,
		},
	})
}
