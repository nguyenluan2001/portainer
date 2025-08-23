package model

import "log"

type AppPathConfig struct {
	ProjectPath string
}

type AppLogger struct {
	InfoLogger    *log.Logger
	WarningLogger *log.Logger
	ErrorLogger   *log.Logger
}
