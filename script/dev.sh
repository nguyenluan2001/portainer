#! /bin/bash

command=$1
PROJECT_PATH="."

function build(){
    docker build -t portainer_dev_img -f Dockerfile.dev \
    --build-arg UID=${UID} \
    --build-arg GID=${GID} \
    .
}

function run(){
    gomod_path="./.go"

    docker rm -f portainer_dev

    if [[ ! -e $gomod_path ]];then
        mkdir .go
    fi

    # --entrypoint /bin/bash /app/entrypoint.dev.sh \
    docker run -it \
    --entrypoint /bin/bash \
    --name portainer_dev \
    -p 5173:5173 -p 5174:5174 \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --mount type=bind,source=${PROJECT_PATH}/server,target=/app/server \
    --mount type=bind,source=${PROJECT_PATH}/client,target=/app/client \
    --mount type=bind,source=${PROJECT_PATH}/.go,target=/go/pkg/mod \
    portainer_dev_img \
    -c "/app/entrypoint.dev.sh"
}

function execCmd(){
    docker exec -it portainer_dev /bin/bash
}

case $command in
    build )
        build
        ;;
    run )
        run
        ;;
    exec )
        execCmd
        ;;
    * )
        echo "Command not found."
        exit 1
        ;;
esac