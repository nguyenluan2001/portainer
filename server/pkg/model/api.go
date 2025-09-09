package model

import "github.com/docker/docker/api/types/container"

type ApiContent struct {
	Status       int         `json:"status"`
	Message      interface{} `json:"message"`
	ErrorMessage string      `json:"error_message"`
}

type GetContainerResponse struct {
	Containers []container.Summary `json:"containers"`
}

type GetContainerDetailResponse struct {
	container.InspectResponse
}

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
