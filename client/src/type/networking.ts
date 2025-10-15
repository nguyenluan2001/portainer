export interface INetworkItem {
    Name: string
    Id: string
    Created: string
    Scope: string
    Driver: string
    EnableIPv4: boolean
    EnableIPv6: boolean
    IPAM: Ipam
    Internal: boolean
    Attachable: boolean
    Ingress: boolean
    ConfigFrom: ConfigFrom
    ConfigOnly: boolean
    Containers: Containers
    Options: Options
    Labels: Labels
}

export interface Ipam {
    Driver: string
    Options: any
    Config: Config[]
}

export interface Config {
    Subnet: string
    Gateway: string
}

export interface ConfigFrom {
    Network: string
}

export interface Containers { }

export interface Options { }

export interface Labels {
    "com.docker.compose.config-hash": string
    "com.docker.compose.network": string
    "com.docker.compose.project": string
    "com.docker.compose.version": string
}

export interface IGetNetworkListResponse {
    networks: INetworkItem[]
}