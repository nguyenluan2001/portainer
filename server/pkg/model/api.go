package model

import (
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	v1 "github.com/opencontainers/image-spec/specs-go/v1"
)

type ApiContent struct {
	Status       int         `json:"status"`
	Message      interface{} `json:"message"`
	ErrorMessage string      `json:"error_message"`
}

// Request struct
type RemoveEndpointsRequest struct {
	Endpoints []string `json:"endpoints" form:"endpoints"`
}

type AddFolderRequest struct {
	Name    string `json:"name" form:"name"`
	DstPath string `json:"dstPath" form:"dstPath"`
}

type UpdateFileRequest struct {
	OldPath string `json:"oldPath" form:"oldPath"`
	NewPath string `json:"newPath" form:"newPath"`
	Content string `json:"content" form:"content"`
}

type CreateFileRequest struct {
	DstPath string `json:"dstPath" form:"dstPath"`
	Content string `json:"content" form:"content"`
}

type CreateContainerRequest struct {
	Config           container.Config         `json:"config" form:"config"`
	HostConfig       container.HostConfig     `json:"hostConfig" form:"hostConfig"`
	NetworkingConfig network.NetworkingConfig `json:"networkingConfig" form:"networkingConfig"`
	Platform         v1.Platform              `json:"platform" form:"platform"`
	ContainerName    string                   `json:"containerName" form:"containerName"`
	IsStart          bool                     `json:"isStart" form:"isStart"`
}

// Response struct

type GetContainerResponse struct {
	Containers []container.Summary `json:"containers"`
}

type GetContainerDetailResponse struct {
	container.InspectResponse
}

type GetImageResponse struct {
	Images []image.Summary `json:"images"`
}
