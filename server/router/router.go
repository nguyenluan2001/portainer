package router

import (
	"embed"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/nguyenluan2001/portainer/server/pkg/config"
	app "github.com/nguyenluan2001/portainer/server/pkg/controller"
	"github.com/nguyenluan2001/portainer/server/pkg/middleware"
)

var WebAssets embed.FS

func InitRouter(app *app.App) {
	router := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024,
	})

	apiRouter := router.Group(config.API_PREFIX_PATH)
	apiRouter.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "*",
	}))
	apiRouter.Get("/check", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Server on")
	})
	apiRouter.Get("/containers", app.GetContainers)
	apiRouter.Get("/containers/:containerId", app.GetContainerDetail)
	apiRouter.Get("/container/detail/:containerId", app.GetContainerDetail)
	apiRouter.Get("/container/kill/:containerId", app.KillContainer)
	apiRouter.Get("/container/restart/:containerId", app.RestartContainer)
	apiRouter.Get("/container/remove/:containerId", app.RemoveContainer)
	apiRouter.Post("/container/copy/:containerId", app.CopyHostToContainer)
	apiRouter.Get("/container/log/:containerId", app.LogContainer)
	apiRouter.Get("/container/filesystem/:containerId", app.GetFilesystemContainer)
	apiRouter.Post("/container/upload/:containerId", app.UploadToContainer)
	apiRouter.Get("/container/download/:containerId", app.DownloadFromContainer)
	apiRouter.Post("/container/remove-endpoints/:containerId", app.RemoveEndpointsContainer)
	apiRouter.Post("/container/fs/add-folder/:containerId", app.AddFolderContainer)
	apiRouter.Post("/container/fs/add-folder/:containerId", app.AddFolderContainer)
	apiRouter.Get("/container/fs/get-file/:containerId", app.GetFileContentContainer)
	apiRouter.Post("/container/fs/update-file/:containerId", app.UpdateFileContainer)

	// WebSocket route handler
	socketRouter := router.Group(config.API_SOCKET_PREFIX_PATH)
	socketRouter.Use("/", middleware.UpgradeWebSocket)
	// app.CollaborateHandler()
	socketRouter.Get("/attach", app.AttachContainer())
	socketRouter.Get("/exec", app.ExecContainer())
	app.SocketListener()
	log.Println("Listening port 5174...")
	router.Listen(":5174")
}
