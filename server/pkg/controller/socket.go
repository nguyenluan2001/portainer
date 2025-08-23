package app

import (
	"fmt"
	"io"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/gofiber/contrib/socketio"
	"github.com/gofiber/fiber/v2"
	"github.com/nguyenluan2001/portainer/server/pkg/docker"
)

type InitConnectionResponse struct {
	Event string `json:"event"`
	UUID  string `json:"uuid"`
}

type socketWriter struct {
	ep *socketio.EventPayload
}

func (sw *socketWriter) Write(p []byte) (n int, err error) {
	log.Println("data", string(p))
	socketio.EmitTo(sw.ep.Kws.GetUUID(), p)
	return len(p), nil
}

func (app *App) AttachContainer() func(*fiber.Ctx) error {
	log.Println("AttachContainer")

	return socketio.New(func(kws *socketio.Websocket) {
		query := kws.Query
		log.Println("quries", query("containerId"))
		kws.SetAttribute("containerId", query("containerId"))
		kws.SetAttribute("action", query("attach"))
	})
}

func (app *App) ExecContainer() func(*fiber.Ctx) error {
	log.Println("ExecContainer")

	return socketio.New(func(kws *socketio.Websocket) {
		query := kws.Query
		log.Println("quries", query("containerId"))
		kws.SetAttribute("containerId", query("containerId"))
		kws.SetAttribute("exec", query("attach"))
	})
}

func (app *App) SocketListener() {
	log.Println("Socket")

	socketio.On(socketio.EventMessage, func(ep *socketio.EventPayload) {
		containerId := fmt.Sprintf("%v", ep.Kws.GetAttribute("containerId"))
		containerAction := fmt.Sprintf("%v", ep.Kws.GetAttribute("action"))
		key := fmt.Sprintf("%s_%s", containerId, containerAction)
		log.Println(string(ep.Data))
		if string(ep.Data) == "START_ATTACH" {
			log.Println("=== START_ATTACH ===")
			hijacked, _ := docker.AttachContainer(app.AppCtx, app.DockerCLI, containerId)
			app.HijackedPool[key] = hijacked
			go func(hijacked types.HijackedResponse) {
				_, err := hijacked.Conn.Write([]byte("\n"))
				if err != nil {
					app.ErrorLogger.Println("Hijacked write failed.")
				}
				io.Copy(&socketWriter{ep}, hijacked.Reader)
			}(hijacked)
		} else if string(ep.Data) == "START_EXEC" {
			log.Println("=== START_EXEC ===")
			log.Println("containerId", containerId)
			hijacked, _ := docker.ExecContainer(app.AppCtx, app.DockerCLI, containerId)
			app.HijackedPool[key] = hijacked
			go func(hijacked types.HijackedResponse) {
				io.Copy(&socketWriter{ep}, hijacked.Reader)
			}(hijacked)
		} else {
			hijacked, ok := app.HijackedPool[key]
			if !ok {
				log.Println("No Hijacked founded")
			} else {
				log.Println("hijacked", hijacked)
				hijacked.Conn.Write(ep.Data)
			}
		}

	})

	log.Println("Socket end")
}
