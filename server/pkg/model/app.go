package model

import "log"

type AppPathConfig struct {
	ProjectPath    string
	RuntimesPath   string
	BinaryTreePath string
}

type AppLogger struct {
	InfoLogger    *log.Logger
	WarningLogger *log.Logger
	ErrorLogger   *log.Logger
}
