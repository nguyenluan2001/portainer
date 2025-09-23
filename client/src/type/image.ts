export interface IImageItem {
    Containers: number
    Created: number
    Id: string
    Labels?: Record<string, string>
    ParentId: string
    RepoDigests: string[]
    RepoTags: string[]
    SharedSize: number
    Size: number
}