package docker

import (
	"context"
	"fmt"
	"io"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/nguyenluan2001/portainer/server/pkg/utils"
)

func CreateDockerClient() (*client.Client, error) {
	return client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
}

func GetContainerList(appCtx context.Context, cli *client.Client) ([]container.Summary, error) {
	return cli.ContainerList(appCtx, container.ListOptions{
		All:    true,
		Latest: true,
	})
}

func GetContainerDetail(appCtx context.Context, cli *client.Client, containerId string) (container.InspectResponse, error) {
	return cli.ContainerInspect(appCtx, containerId)
}

func AttachContainer(appCtx context.Context, cli *client.Client, containerId string) (types.HijackedResponse, error) {
	return cli.ContainerAttach(appCtx, containerId, container.AttachOptions{
		Stdin:  true,
		Stdout: true,
		Stderr: true,
		Stream: true,
	})
}

func ExecContainer(appCtx context.Context, cli *client.Client, containerId, cmd string) (types.HijackedResponse, error) {
	defaultCmd := "/bin/sh"
	if cmd != "" {
		defaultCmd = cmd
	}
	execResponse, _ := cli.ContainerExecCreate(appCtx, containerId, container.ExecOptions{
		AttachStdin:  true,
		AttachStderr: true,
		AttachStdout: true,
		Tty:          true,
		Cmd:          []string{defaultCmd},
	})
	log.Println("execResponse", execResponse)
	return cli.ContainerExecAttach(appCtx, execResponse.ID, container.ExecAttachOptions{
		Detach: false,
		Tty:    true,
	})
}

func GetFilesystemContainer(appCtx context.Context, cli *client.Client, containerId, binaryPath, path string) (types.HijackedResponse, error) {
	// option := `--timefmt "%H:%M:%S %d/%m/%Y" -pasDuJ -L 1 --noreport --dirsfirst `
	option := `--timefmt "%s" -pasDuJ -L 1 --noreport --dirsfirst `
	cmd := fmt.Sprintf(`%s %s  %s`, binaryPath, option, path)
	log.Println("GetFilesystemContainer", cmd)
	execResponse, _ := cli.ContainerExecCreate(appCtx, containerId, container.ExecOptions{
		AttachStderr: true,
		AttachStdout: true,
		Tty:          true,
		Cmd:          []string{"sh", "-c", cmd},
	})
	return cli.ContainerExecAttach(appCtx, execResponse.ID, container.ExecAttachOptions{
		Detach: false,
		Tty:    true,
	})
}

func RemoveEndpointsContainer(appCtx context.Context, cli *client.Client, containerId string, endpoints []string) (types.HijackedResponse, error) {
	script := utils.GenerateRemoveEndpointsScript(endpoints)
	cmd := fmt.Sprintf("echo '%s' > remove.sh && sh remove.sh && rm remove.sh", script)
	execResponse, _ := cli.ContainerExecCreate(appCtx, containerId, container.ExecOptions{
		AttachStderr: true,
		AttachStdout: true,
		Tty:          true,
		Cmd:          []string{"sh", "-c", cmd},
	})
	return cli.ContainerExecAttach(appCtx, execResponse.ID, container.ExecAttachOptions{
		Detach: false,
		Tty:    true,
	})
}

func FsManageContainer(appCtx context.Context, cli *client.Client, containerId string, cmd string) (types.HijackedResponse, error) {
	execResponse, _ := cli.ContainerExecCreate(appCtx, containerId, container.ExecOptions{
		AttachStderr: true,
		AttachStdout: true,
		Tty:          true,
		Cmd:          []string{"sh", "-c", cmd},
	})
	return cli.ContainerExecAttach(appCtx, execResponse.ID, container.ExecAttachOptions{
		Detach: false,
		Tty:    true,
	})
}

func RestartContainer(appCtx context.Context, cli *client.Client, containerId string) error {
	return cli.ContainerRestart(appCtx, containerId, container.StopOptions{})
}

func KillContainer(appCtx context.Context, cli *client.Client, containerId string) error {
	return cli.ContainerKill(appCtx, containerId, "SIGKILL")
}

func RemoveContainer(appCtx context.Context, cli *client.Client, containerId string) error {
	return cli.ContainerRemove(appCtx, containerId, container.RemoveOptions{})
}

func CopyToContainer(appCtx context.Context, cli *client.Client, containerId, dstPath string, content io.Reader) error {
	return cli.CopyToContainer(appCtx, containerId, dstPath, content, container.CopyToContainerOptions{
		AllowOverwriteDirWithFile: true,
	})
}

func CopyFromContainer(appCtx context.Context, cli *client.Client, containerId, srcPath string) (io.ReadCloser, container.PathStat, error) {
	return cli.CopyFromContainer(appCtx, containerId, srcPath)
}

func LogContainer(appCtx context.Context, cli *client.Client, containerId string) (io.ReadCloser, error) {
	return cli.ContainerLogs(appCtx, containerId, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     true,
		Details:    true,
	})
}

// func CreateContainer(appCtx context.Context, cli *client.Client, mountDir string, version models.Version) (container.CreateResponse, error) {
// 	// --- Pull the Docker image if it's not available locally ---
// 	fmt.Printf("Pulling image: %s...\n", version.DockerImage)
// 	fmt.Println("mountDir", mountDir)
// 	reader, err := cli.ImagePull(appCtx, version.DockerImage, image.PullOptions{})

// 	if err != nil {
// 		// Handle the case where pulling might not be strictly necessary if the image exists
// 		fmt.Printf("Warning: Failed to pull image %s: %v. Attempting to use local image.\n", version.DockerImage, err)
// 	} else {
// 		// Wait for the pull to complete (optional, but good for demonstration)
// 		io.Copy(os.Stdout, reader)
// 		reader.Close()
// 		fmt.Println("Image pulled successfully.")
// 	}

// 	// --- Create the Docker container configuration ---
// 	return cli.ContainerCreate(appCtx, &container.Config{
// 		Image:      version.DockerImage,
// 		WorkingDir: "/app",
// 		User:       "root",
// 		Cmd:        version.RunCmd,
// 		// Cmd: []string{"ls","-l","/app"},
// 		Tty: false, // Disable TTY to separate stdout and stderr streams
// 		// Define standard streams to be attached
// 		AttachStdout: true,
// 		AttachStderr: true,
// 	}, &container.HostConfig{
// 		// Mount the temporary directory containing the code file into the container
// 		Binds: []string{fmt.Sprintf("%s:/app", mountDir)},
// 	}, nil, nil, "") // No custom name, Docker generates one
// }
// func CreateFormatterContainer(appCtx context.Context, cli *client.Client, formatterPath, code, language string) (container.CreateResponse, error) {
// 	// --- Create the Docker container configuration ---
// 	escapedCodeString := strings.ReplaceAll(code, "\n", "\\n")
// 	escapedCodeString = strings.ReplaceAll(escapedCodeString, "\t", "\\t")

// 	sourceCode_env := "SOURCE_CODE=" + escapedCodeString
// 	language_env := "LANGUAGE=" + language
// 	fmt.Println("sourceCodeEnv", sourceCode_env)
// 	return cli.ContainerCreate(appCtx, &container.Config{
// 		Image: config.FORMATTER_DOCKER_IMAGE,
// 		User:  "root",
// 		Tty:   false, // Disable TTY to separate stdout and stderr streams
// 		// Cmd:  []string{"bash", "/app/entrypoint.sh"},
// 		Env: []string{
// 			language_env,
// 			sourceCode_env,
// 		},
// 		AttachStdout: true,
// 		AttachStderr: true,
// 	}, &container.HostConfig{}, nil, nil, "formatter_container") // No custom name, Docker generates one
// }
// func ReadOutputFromContainer(cli *client.Client, appCtx context.Context, createdContainer container.CreateResponse) (string, string) {
// 	var stdoutBuf, stderrBuf bytes.Buffer
// 	attach, attachErr := cli.ContainerAttach(appCtx, createdContainer.ID, container.AttachOptions{
// 		Stream: true,
// 		Stdout: true,
// 		Stderr: true,
// 	})
// 	fmt.Println("attachError", attachErr)
// 	if attachErr != nil {
// 		return "", ""
// 	}
// 	_, err := stdcopy.StdCopy(&stdoutBuf, &stderrBuf, attach.Reader)
// 	if err != nil {
// 		fmt.Fprintf(os.Stderr, "Error reading container output: %v\n", err)
// 	}
// 	fmt.Println("stdOut: ", stdoutBuf.String())
// 	fmt.Println("stdErr: ", stderrBuf.String())
// 	return stdoutBuf.String(), stderrBuf.String()
// }

// // Return the standard output, standard error, and any error encountered.
// func StartContainer(cli *client.Client, appCtx context.Context, createdContainer container.CreateResponse) (string, string, error) {

// 	// --- Start the container ---
// 	fmt.Printf("Starting container: %s...\n", createdContainer.ID)
// 	if err := cli.ContainerStart(appCtx, createdContainer.ID, container.StartOptions{}); err != nil {
// 		return "", "", fmt.Errorf("failed to start container %s: %w", createdContainer.ID, err)
// 	}
// 	fmt.Println("Container started.")

// 	// --- Wait for the container to finish and get its exit status ---
// 	// Use a context with a timeout to prevent infinite waits
// 	waitCtx, cancel := context.WithTimeout(appCtx, 10*time.Second) // Example timeout: 10 seconds
// 	defer cancel()

// 	statusCh, errCh := cli.ContainerWait(waitCtx, createdContainer.ID, container.WaitConditionNotRunning)

// 	// --- Read output from the attached streams ---
// 	// Use stdcopy.StdCopy to demultiplex stdout and stderr from the single stream
// 	stdoutStr, stderrStr := ReadOutputFromContainer(cli, appCtx, createdContainer)

// 	// --- Handle waiting for the container ---
// 	select {
// 	case status := <-statusCh:
// 		// Container finished, check exit code
// 		if status.StatusCode != 0 {
// 			// Non-zero exit code indicates a runtime error in the user's code
// 			return stdoutStr, stderrStr, fmt.Errorf("container exited with status code %d", status.StatusCode)
// 		}
// 		// Container finished successfully
// 		return stdoutStr, stderrStr, nil

// 	case err := <-errCh:
// 		// Error while waiting for the container
// 		return stdoutStr, stderrStr, fmt.Errorf("error waiting for container %s: %w", createdContainer.ID, err)

// 	case <-waitCtx.Done():
// 		// Timeout occurred
// 		// Attempt to stop the container gracefully first, then force remove
// 		fmt.Printf("Container %s timed out. Attempting to stop...\n", createdContainer.ID)
// 		stopTimeout := int(5 * time.Second) // Graceful stop timeout
// 		stopErr := cli.ContainerStop(context.Background(), createdContainer.ID, container.StopOptions{Timeout: &stopTimeout})
// 		if stopErr != nil {
// 			fmt.Fprintf(os.Stderr, "Error stopping container %s after timeout: %v\n", createdContainer.ID, stopErr)
// 		}

// 		return stdoutStr, stderrStr, fmt.Errorf("execution timed out after %s", 10*time.Second)
// 	}

// }
