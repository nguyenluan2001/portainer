package app

import (
	"archive/tar"
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"path"

	"github.com/docker/docker/pkg/stdcopy"
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

	path := "/app/runtimes/packages/tree"
	destPath := "/usr/bin"
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

func (app *App) UploadToContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	file, _ := ctx.FormFile("file")
	dstPath := ctx.Query("dstPath")
	filePath := path.Join(app.PathConfig.RuntimesPath, "upload", file.Filename)
	ctx.SaveFile(file, filePath)

	archive, _ := utils.CreateTarArchive(filePath)
	err := docker.CopyToContainer(app.AppCtx, app.DockerCLI, containerId, dstPath, archive)

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

func (app *App) DownloadFromContainer(ctx *fiber.Ctx) error {
	log.Println("DownloadFromContainer")
	containerId := ctx.Params("containerId")
	srcPath := ctx.Query("srcPath")
	ioReader, pathStat, err := docker.CopyFromContainer(app.AppCtx, app.DockerCLI, containerId, srcPath)

	if err != nil {
		app.ErrorLogger.Println("Copy from container failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Copy from container failed.",
			Message:      nil,
		})
	}

	fileName := pathStat.Name
	attachment := fmt.Sprintf("attachment; filename=%s", fileName)
	ctx.Set("Content-Disposition", attachment)

	tarReader := tar.NewReader(ioReader)

	// Extract the file from the tar archive
	_, extractErr := tarReader.Next()

	if extractErr != nil {
		app.ErrorLogger.Println("Extract file from container failed", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Extract file from container failed",
			Message:      nil,
		})
	}
	return ctx.SendStream(tarReader)
}

type sseWriter struct {
	w *bufio.Writer
}

func (sw *sseWriter) Write(p []byte) (n int, err error) {
	// Write the SSE 'data' prefix and a newline
	if _, err := sw.w.Write([]byte("data: ")); err != nil {
		return 0, err
	}
	// Write the actual log message
	if _, err := sw.w.Write(p); err != nil {
		return 0, err
	}
	// Write two newlines to mark the end of the SSE event
	if _, err := sw.w.Write([]byte("\n\n")); err != nil {
		return 0, err
	}

	// Use http.Flusher to send the data immediately
	sw.w.Flush()

	return len(p), nil
}
func (app *App) LogContainer(ctx *fiber.Ctx) error {
	ctx.Set("Content-Type", "text/event-stream")
	ctx.Set("Cache-Control", "no-cache")
	ctx.Set("Connection", "keep-alive")
	ctx.Set("Transfer-Encoding", "chunked")

	containerId := ctx.Params("containerId")
	log.Println("containerId", containerId)

	ctx.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		for {
			ioReader, err := docker.LogContainer(app.AppCtx, app.DockerCLI, containerId)
			if err != nil {
				app.ErrorLogger.Println("Log the container detail failed.", err)
				return
			}
			writer := &sseWriter{w}

			reader := bufio.NewReader(ioReader)
			_, err = stdcopy.StdCopy(writer, writer, reader)
			if err != nil {
				app.ErrorLogger.Println("Copy log to writer failed.", err)
				return
			}
			ioReader.Close()
		}
	}))
	return nil
}

func (app *App) GetFilesystemContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	path := ctx.Query("path", "/")
	log.Println("containerId", containerId)
	log.Println("path", path)

	//Copy binary file of tree to container
	srcPath := app.PathConfig.BinaryTreePath
	destPath := "/usr/bin"
	binaryPath := fmt.Sprintf("%s/tree", destPath)
	archive, _ := utils.CreateTarArchive(srcPath)
	err := docker.CopyToContainer(app.AppCtx, app.DockerCLI, containerId, destPath, archive)

	if err != nil {
		app.ErrorLogger.Println("Copy to container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Copy to container detail failed.",
			Message:      nil,
		})
	}

	// Get filesystem
	hijacked, err := docker.GetFilesystemContainer(app.AppCtx, app.DockerCLI, containerId, binaryPath, path)

	if err != nil {
		app.ErrorLogger.Println("Exec the container detail failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Exec the container detail failed.",
			Message:      nil,
		})
	}

	// Get response from hijacked
	var stdout bytes.Buffer
	stdoutWriter := bufio.NewWriter(&stdout)
	io.Copy(stdoutWriter, hijacked.Reader)
	if err != nil {
		log.Fatalf("Failed to copy output: %v", err)
	}
	stdoutWriter.Flush()
	var filesystem []model.Filesystem
	var filesystemResp model.Filesystem
	json.Unmarshal([]byte(stdout.Bytes()), &filesystem)
	defer hijacked.Close()

	if len(filesystem) > 0 {
		filesystemResp = filesystem[0]
	}

	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      filesystemResp,
	})
}

func (app *App) RemoveEndpointsContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	var requestParams = new(model.RemoveEndpointsRequest)

	if err := ctx.BodyParser(requestParams); err != nil {
		app.AppLogger.ErrorLogger.Println("BodyParser failed: ", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Remove endpoints failed.",
			Message:      nil,
		})
	}

	log.Println("requestParams", requestParams)
	cmd := utils.GenerateRemoveEndpointsScript(requestParams.Endpoints)
	// hijacked, err := docker.RemoveEndpointsContainer(app.AppCtx, app.DockerCLI, containerId, requestParams.Endpoints)
	hijacked, err := docker.FsManageContainer(app.AppCtx, app.DockerCLI, containerId, cmd)

	var buff bytes.Buffer

	writer := bufio.NewWriter(&buff)

	io.Copy(writer, hijacked.Reader)
	writer.Flush()

	line, _ := buff.ReadString('\n')

	log.Println("hijacked response", line)

	if err != nil {
		app.ErrorLogger.Println("Remove endpoints failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Remove endpoints failed.",
			Message:      nil,
		})
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Remove endpoints failed.",
	})
}

func (app *App) AddFolderContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	var requestParams = new(model.AddFolderRequest)

	if err := ctx.BodyParser(requestParams); err != nil {
		app.AppLogger.ErrorLogger.Println("BodyParser failed: ", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Add folder failed.",
			Message:      nil,
		})
	}

	log.Println("requestParams", requestParams)
	cmd := utils.AddFolderScript(requestParams.DstPath, requestParams.Name)
	_, err := docker.FsManageContainer(app.AppCtx, app.DockerCLI, containerId, cmd)
	if err != nil {
		app.ErrorLogger.Println("Add folder failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Add folder failed.",
			Message:      nil,
		})
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Add folder failed.",
	})
}

func (app *App) GetFileContentContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	path := ctx.Query("path")

	cmd := utils.GetFileContentScript(path)
	hijacked, err := docker.FsManageContainer(app.AppCtx, app.DockerCLI, containerId, cmd)

	var buff bytes.Buffer
	writer := bufio.NewWriter(&buff)

	io.Copy(writer, hijacked.Reader)
	writer.Flush()

	defer hijacked.Close()
	if err != nil {
		app.ErrorLogger.Println("Get file content failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Get file content failed.",
			Message:      nil,
		})
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      buff.String(),
	})
}

func (app *App) UpdateFileContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	var requestParams = new(model.UpdateFileRequest)

	if err := ctx.BodyParser(requestParams); err != nil {
		app.AppLogger.ErrorLogger.Println("BodyParser failed: ", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Update file failed.",
			Message:      nil,
		})
	}

	cmd := ""

	if requestParams.OldPath == requestParams.NewPath {
		cmd = fmt.Sprintf("printf '%%s' '%%s' > '%s'", requestParams.Content, requestParams.OldPath)
	} else {
		cmd = fmt.Sprintf("printf '%%s' '%%s' > '%s' && mv '%s' '%s'", fmt.Sprintf(`%s`, requestParams.Content), requestParams.OldPath, requestParams.OldPath, requestParams.NewPath)
	}
	log.Println("cmd", cmd)
	log.Println("content", fmt.Sprintf(`%%s`, requestParams.Content))
	_, err := docker.FsManageContainer(app.AppCtx, app.DockerCLI, containerId, cmd)

	if err != nil {
		app.ErrorLogger.Println("Get file content failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Get file content failed.",
			Message:      nil,
		})
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Update file success",
	})
}

func (app *App) CreateFileContainer(ctx *fiber.Ctx) error {
	containerId := ctx.Params("containerId")
	var requestParams = new(model.CreateFileRequest)

	if err := ctx.BodyParser(requestParams); err != nil {
		app.AppLogger.ErrorLogger.Println("BodyParser failed: ", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Create file failed.",
			Message:      nil,
		})
	}

	cmd := fmt.Sprintf(`echo '%s' > "%s"`, requestParams.Content, requestParams.DstPath)
	log.Println("cmd", cmd)
	_, err := docker.FsManageContainer(app.AppCtx, app.DockerCLI, containerId, cmd)

	if err != nil {
		app.ErrorLogger.Println("Create file content failed.", err)
		return ctx.JSON(model.ApiContent{
			Status:       1,
			ErrorMessage: "Create file content failed.",
			Message:      nil,
		})
	}
	return ctx.JSON(model.ApiContent{
		Status:       0,
		ErrorMessage: "",
		Message:      "Create file success",
	})
}
