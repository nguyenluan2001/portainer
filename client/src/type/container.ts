export interface IContainerItem {
	Id: string;
	Names: string[];
	Image: string;
	ImageID: string;
	Command: string;
	Created: number;
	Ports: any[];
	// Labels: Labels
	State: string;
	Status: string;
	// HostConfig: HostConfig
	// NetworkSettings: NetworkSettings
	Mounts: any[];
}

export interface ICreateContainerRequest {
	config: IContainerConfig,
	hostConfig: IHostConfig,
	networkingConfig: any,
	platform: any,
	containerName: string,
	isStart: boolean
}

export interface IContainerConfig {
	Hostname: string,
	Domainname: string,
	User: string,
	AttachStdin: boolean,
	AttachStdout: boolean,
	AttachStderr: boolean,
	ExposedPorts: Record<string, string>,
	Tty: boolean,
	OpenStdin: boolean,
	StdinOnce: boolean,
	Env: string[],
	Cmd: string[],
	Healthcheck: any,
	ArgsEscaped: boolean,
	Image: string,
	Volumes: Record<string, string>,
	WorkingDir: string,
	Entrypoint: any,
	NetworkDisabled: boolean,
	MacAddress: string,
	OnBuild: string[],
	Labels: Record<string, string>,
	StopSignal: string,
	StopTimeout: number,
	Shell: string[],
}

export interface IHostConfig {
	// Applicable to all platforms
	Binds: string[],          // List of volume bindings for this container
	ContainerIDFile: string,            // File (path) where the containerId is written
	LogConfig: any                // Configuration of the logs for this container
	NetworkMode: string,       // Network mode to use for the container
	PortBindings: Record<string, string>,       // Port mapping between the exposed port (container) and the host
	RestartPolicy: string,     // Restart policy to be used for the container
	AutoRemove: boolean,              // Automatically remove container when it exits
	VolumeDriver: string,            // Name of the volume driver used to mount volumes
	VolumesFrom: string[],          // List of volumes to take from other container
	ConsoleSize: number[],          // Initial console size (height,width)
	Annotations: Record<string, string>

	// Applicable to UNIX platforms
	CapAdd: string[] // List of kernel capabilities to add to the container
	CapDrop: string[] // List of kernel capabilities to remove from the container
	CgroupnsMode: string,      // Cgroup namespace mode to use for the container
	DNS: string[],        // List of DNS server to lookup
	DNSOptions: string[] // List of DNSOption to look for
	DNSSearch: string[]  // List of DNSSearch to look for
	ExtraHosts: string[]          // List of extra hosts
	GroupAdd: string[]          // List of additional groups that the container process will run as
	IpcMode: string           // IPC namespace to use for the container
	Cgroup: string        // Cgroup to use for the container
	Links: string[]          // List of links (in the name:alias form)
	OomScoreAdj: number,               // Container preference for OOM-killing
	PidMode: string           // PID namespace to use for the container
	Privileged: boolean              // Is the container in privileged mode
	PublishAllPorts: boolean              // Should docker publish all exposed port for the container
	ReadonlyRootfs: boolean              // Is the container root filesystem in read-only
	SecurityOpt: string[]          // List of string values to customize labels for MLS systems, such as SELinux.
	StorageOpt: Record<string, string> // Storage driver options per container.
	Tmpfs: Record<string, string> // List of tmpfs (mounts) used for the container
	UTSMode: string,           // UTS namespace to use for the container
	UsernsMode: string        // The user namespace to use for the container
	ShmSize: number             // Total shm memory usage
	Sysctls: Record<string, string> // List of Namespaced sysctls used for the container
	Runtime: string// Runtime to use with this container

	// Applicable to Windows
	Isolation: string // Isolation technology of the container (e.g. default, hyperv)

	// Contains container's resources (cgroups, ulimits)

	// Mounts specs used by the container
	Mounts: Record<string, string>

	// MaskedPaths is the list of paths to be masked inside the container (this overrides the default set of paths)
	MaskedPaths: string[]

	// ReadonlyPaths is the list of paths to be set as read-only inside the container (this overrides the default set of paths)
	ReadonlyPaths: string[]

	// Run a custom init inside the container, if null, use the daemon's configured settings
	Init: boolean
}