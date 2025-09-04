package utils

import (
	"archive/tar"
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
)

// createTarArchive creates an in-memory tar archive from a single file.
func CreateTarArchive(filePath string) (io.Reader, error) {
	log.Println("filePath:", filePath)
	destinationFile, err := os.Create("/home/luannguyen/Workspace/golang/portainer/test2.sh")

	// 1. Get file information
	fileInfo, err := os.Stat(filePath)
	log.Println("fileInfo:", fileInfo.Name(), fileInfo.Size())
	if err != nil {
		return nil, fmt.Errorf("failed to get file info: %w", err)
	}

	// 2. Open the file to read its content
	file, err := os.Open(filePath)
	io.Copy(destinationFile, file)
	defer destinationFile.Close()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// 3. Create a bytes.Buffer to hold the in-memory tar archive
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	defer tw.Close()

	// 4. Create the tar header from the file info
	header, err := tar.FileInfoHeader(fileInfo, "")
	if err != nil {
		return nil, fmt.Errorf("failed to create tar header: %w", err)
	}

	// 5. Set the header name to what it will be in the container
	header.Name = fileInfo.Name()

	// 6. Write the header to the archive
	if err := tw.WriteHeader(header); err != nil {
		return nil, fmt.Errorf("failed to write tar header: %w", err)
	}

	// 7. Copy the file content into the archive
	if _, err := io.Copy(tw, file); err != nil {
		return nil, fmt.Errorf("failed to copy file content to tar: %w", err)
	}

	// Return the buffer as an io.Reader
	return &buf, nil
}
