package docker

import (
	"context"

	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
)

func GetNetworkList(appCtx context.Context, cli *client.Client) ([]network.Summary, error) {
	return cli.NetworkList(appCtx, network.ListOptions{})
}
