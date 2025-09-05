package app

import (
	"bufio"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/docker"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
	"github.com/nguyenluan2001/portainer/server/pkg/utils"
	"github.com/valyala/fasthttp"
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

func (app *App) RestartContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	err := docker.RestartContainer(app.AppCtx, app.DockerCLI, containerId)

	if err != nil {
		app.ErrorLogger.Println("Restart container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Restart container detail failed.",
			Message:      nil,
		})
	}

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Restart container successfully",
	})
}

func (app *App) KillContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	err := docker.KillContainer(app.AppCtx, app.DockerCLI, containerId)

	if err != nil {
		app.ErrorLogger.Println("Kill container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Kill container detail failed.",
			Message:      nil,
		})
	}

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Kill container successfully",
	})
}

func (app *App) RemoveContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	err := docker.RemoveContainer(app.AppCtx, app.DockerCLI, containerId)

	if err != nil {
		app.ErrorLogger.Println("Remove container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Remove container detail failed.",
			Message:      nil,
		})
	}

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Remove container successfully",
	})
}

func (app *App) CopyHostToContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")

	path := "/app/share/test.sh"
	destPath := "/"
	archive, _ := utils.CreateTarArchive(path)
	err := docker.CopyToContainer(app.AppCtx, app.DockerCLI, containerId, destPath, archive)

	if err != nil {
		app.ErrorLogger.Println("Copy to container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Copy to container detail failed.",
			Message:      nil,
		})
	}

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Copy to container successfully",
	})
}

func (app *App) LogContainer(ctx *fiber.Ctx) error {
	ctx.Set("Content-Type", "text/event-stream")
	ctx.Set("Cache-Control", "no-cache")
	ctx.Set("Connection", "keep-alive")
	ctx.Set("Transfer-Encoding", "chunked")

	containerId := ctx.Params("containerId")
	log.Println("containerId", containerId)

	// go func(appCtx context.Context, dockerCli *client.Client, ctx *fiber.Ctx, containerId string) {
	// 	ioReader, err := docker.LogContainer(app.AppCtx, app.DockerCLI, containerId)

	// 	if err != nil {
	// 		app.ErrorLogger.Println("Log the container detail failed.", err)
	// 	}

	// 	reader := bufio.NewReader(ioReader)

	// 	for {
	// 		line, err := reader.ReadString('\n')
	// 		log.Println("line", line)
	// 		if err != nil {
	// 			log.Println("Error reading from container logs:", err)
	// 			break
	// 		}
	// 		ctx.SendStream(reader)
	// 	}

	// }(app.AppCtx, app.DockerCLI, ctx, containerId)

	ctx.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		for {
			// Format the SSE message
			// eventData := fmt.Sprintf("data: The current time is %s\n\n", time.Now().Format(time.RFC1123Z))
			// _, err := w.WriteString(eventData)
			// if err != nil {
			// 	log.Println("Error writing to stream:", err)
			// 	return // Exit on error (e.g., client disconnected)
			// }
			// w.Flush() // Ensure data is sent immediately

			// time.Sleep(2 * time.Second) // Send an event every 2 seconds

			ioReader, err := docker.LogContainer(app.AppCtx, app.DockerCLI, containerId)
			if err != nil {
				app.ErrorLogger.Println("Log the container detail failed.", err)
				return
			}
			reader := bufio.NewReader(ioReader)
			// io.Copy(w, reader)
			previousLine := ""
			for {
				line, err := reader.ReadString('\n')
				log.Println("line", line)
				if err != nil {
					log.Println("Error reading from container logs:", err)
					break
				}
				if line == previousLine {
					continue
				}
				previousLine = line
				eventData := fmt.Sprintf("data: %s\n\n", line)
				w.WriteString(eventData)
				w.Flush() // Ensure data is sent immediately
			}
		}
	}))
	return nil

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Logs to container successfully",
	})
}
