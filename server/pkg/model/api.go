package model

import (
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
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

// CreateContainerRequest
type CreateContainerRequest struct {
	// Config           container.Config         `json:"config" form:"config"`
	// HostConfig       container.HostConfig     `json:"hostConfig" form:"hostConfig"`
	// NetworkingConfig network.NetworkingConfig `json:"networkingConfig" form:"networkingConfig"`
	// Platform         v1.Platform              `json:"platform" form:"platform"`

	ContainerName string         `json:"containerName" form:"containerName"`
	Image         string         `json:"image" form:"image"`
	RestartPolicy string         `json:"restart_policy" form:"restart_policy"`
	Ports         []PortConfig   `json:"ports" form:"ports"`
	Volumes       []VolumeConfig `json:"volumes" form:"volumes"`
	Environments  []EnvConfig    `json:"environments" form:"environments"`
	NetworkId     string         `json:"network_id" form:"network_id"`
	IsStart       bool           `json:"isStart" form:"isStart"`
}

type PortConfig struct {
	Host      string `json:"host" form:"host"`
	Container string `json:"container" form:"container"`
	Protocol  string `json:"protocol" form:"protocol"`
}

type VolumeConfig struct {
	Host      string `json:"host" form:"host"`
	Container string `json:"container" form:"container"`
}

type EnvConfig struct {
	Key   string `json:"key" form:"key"`
	Value string `json:"value" form:"value"`
}

// ============================

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

type GetNetworkListResponse struct {
	Networks []network.Summary `json:"networks"`
}
