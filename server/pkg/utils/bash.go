package utils

import (
	"fmt"
	"path"
	"strings"
)

func GenerateRemoveEndpointsScript(endpoints []string) string {
	// endpointsJoined := strings.Join(endpoints, " ")
	// arrayStr := fmt.Sprintf(`declare -a endpoints=( %s )`, endpointsJoined)
	endpointsArr := []string{}

	for _, endpoint := range endpoints {
		endpointsArr = append(endpointsArr, fmt.Sprintf(`"%s"`, endpoint))
	}
	endpointsJoined := strings.Join(endpointsArr, " ")
	arrayStr := fmt.Sprintf(`set -- %s`, endpointsJoined)
	script := fmt.Sprintf(`
	%s
	for value in "$@"
	do
		echo "Value for fruits array is: ${value}"
		rm -rf "$value"
	done
	`, arrayStr)
	script = fmt.Sprintf("echo '%s' > remove.sh && sh remove.sh && rm remove.sh", script)
	return script
}

func AddFolderScript(dstPath, name string) string {
	script := fmt.Sprintf(`
	mkdir "%s"
	`, path.Join(dstPath, name))
	return script
}
