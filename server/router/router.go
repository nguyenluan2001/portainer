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

	containerRouter := apiRouter.Group("/containers")
	containerRouter.Post("/create", app.GetContainerDetail)
	containerRouter.Get("/detail/:containerId", app.GetContainerDetail)
	containerRouter.Get("/kill/:containerId", app.KillContainer)
	containerRouter.Get("/restart/:containerId", app.RestartContainer)
	containerRouter.Get("/remove/:containerId", app.RemoveContainer)
	containerRouter.Post("/copy/:containerId", app.CopyHostToContainer)
	containerRouter.Get("/log/:containerId", app.LogContainer)
	containerRouter.Get("/filesystem/:containerId", app.GetFilesystemContainer)
	containerRouter.Post("/upload/:containerId", app.UploadToContainer)
	containerRouter.Get("/download/:containerId", app.DownloadFromContainer)
	containerRouter.Post("/remove-endpoints/:containerId", app.RemoveEndpointsContainer)
	containerRouter.Post("/fs/add-folder/:containerId", app.AddFolderContainer)
	containerRouter.Post("/fs/add-folder/:containerId", app.AddFolderContainer)
	containerRouter.Get("/fs/get-file/:containerId", app.GetFileContentContainer)
	containerRouter.Post("/fs/update-file/:containerId", app.UpdateFileContainer)
	containerRouter.Post("/fs/create-file/:containerId", app.CreateFileContainer)

	imageRouter := apiRouter.Group("/image")
	imageRouter.Get("list", app.GetImageList)

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
