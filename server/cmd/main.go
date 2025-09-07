package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path"

	"github.com/docker/docker/api/types"
	app "github.com/nguyenluan2001/portainer/server/pkg/controller"
	"github.com/nguyenluan2001/portainer/server/pkg/docker"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
	"github.com/nguyenluan2001/portainer/server/router"
)

func initLogger(projectPath string) model.AppLogger {
	logPath := path.Join(projectPath, "runtimes", "app.log")
	log.Println("LOG PATH: ", logPath)
	file, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Println("error", err)
		log.Fatal(err)
	}

	InfoLogger := log.New(file, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	WarningLogger := log.New(file, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger := log.New(file, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
	return model.AppLogger{
		InfoLogger:    InfoLogger,
		WarningLogger: WarningLogger,
		ErrorLogger:   ErrorLogger,
	}
}

func main() {
	dockerCLI, _ := docker.CreateDockerClient()
	appCtx := context.Background()
	workingDir, _ := os.Getwd()
	projectPath := fmt.Sprintf("%s/../../", workingDir)
	appLogger := initLogger(projectPath)

	app := app.App{
		DockerCLI: dockerCLI,
		AppCtx:    appCtx,
		PathConfig: model.AppPathConfig{
			ProjectPath:    projectPath,
			RuntimesPath:   path.Join(projectPath, "runtimes"),
			BinaryTreePath: "/usr/bin/tree",
		},
		AppLogger:    appLogger,
		HijackedPool: map[string]types.HijackedResponse{},
	}
	app.InfoLogger.Println("Application starting...")
	router.InitRouter(&app)
}
