package utils

import (
	"fmt"

	"github.com/docker/docker/api/types/container"
	"github.com/nguyenluan2001/portainer/server/pkg/model"
)

func ParseContainerConfig(image string, ports []model.PortConfig, environments []model.EnvConfig, volumes []model.VolumeConfig) *container.Config {
	envList := []string{}

	for _, env := range environments {
		envList = append(envList, fmt.Sprintf("%v=%v", env.Key, env.Value))
	}
	return &container.Config{
		Image: image,
	}
}
