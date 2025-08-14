#! /bin/bash

PROJECT_PATH=$(pwd)
# === Start client ===
cd $PROJECT_PATH/client
bun install 
bun run dev --host
