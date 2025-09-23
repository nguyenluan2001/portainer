package docker

import (
	"context"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

func GetImageList(appCtx context.Context, cli *client.Client) ([]image.Summary, error) {
	return cli.ImageList(appCtx, image.ListOptions{})
}
