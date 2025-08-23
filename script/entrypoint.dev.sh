#! /bin/bash

PROJECT_PATH=$(pwd)
PROJECT_NAME=portainer

# Check if the session is interactive
if [ -t 0 ]; then
  # Start a new detached tmux session if one doesn't exist
  tmux has-session -t $PROJECT_NAME 2>/dev/null
  if [ $? != 0 ]; then
    tmux new-session -d -s $PROJECT_NAME -n 'main'

    # Split the window vertically
    tmux split-window -h -t $PROJECT_NAME:0.0

    # Rename the panes
    tmux select-pane -t $PROJECT_NAME:0.0 -T 'server'
    tmux select-pane -t $PROJECT_NAME:0.1 -T 'client'

    # Send commands to each pane
    tmux send-keys -t $PROJECT_NAME:0.0 'cd server/cmd' C-m
    tmux send-keys -t $PROJECT_NAME:0.0 'go run main.go' C-m
    tmux send-keys -t $PROJECT_NAME:0.1 'cd client' C-m
    tmux send-keys -t $PROJECT_NAME:0.1 'bun install' C-m
    tmux send-keys -t $PROJECT_NAME:0.1 'bun run dev' C-m
  fi

  # Attach to the tmux session
  exec tmux attach-session -t $PROJECT_NAME
else
  # If not interactive, just run the default command
  exec "$@"
fi



# # === Start client ===
# cd $PROJECT_PATH/client
# bun install 
# bun run dev --host
