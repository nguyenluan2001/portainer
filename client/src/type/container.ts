export interface IContainerItem {
    Id: string
    Names: string[]
    Image: string
    ImageID: string
    Command: string
    Created: number
    Ports: any[]
    // Labels: Labels
    State: string
    Status: string
    // HostConfig: HostConfig
    // NetworkSettings: NetworkSettings
    Mounts: any[]
}