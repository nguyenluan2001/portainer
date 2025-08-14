package router

import (
	"embed"

	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/config"
)

var WebAssets embed.FS

func InitRouter() {
	router := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024,
	})
	router.Static("/", "./static")
	router.Static("/share/*", "./static")

	apiRouter := router.Group(config.API_PREFIX_PATH)
	apiRouter.Get("/check", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Server on")
	})

	// WebSocket route handler
	// socketRouter := router.Use("/ws", middleware.UpgradeWebSocket)
	// app.CollaborateHandler()
	// socketRouter.Get("/ws", app.InitConnection())

	router.Listen(":5174")
}
