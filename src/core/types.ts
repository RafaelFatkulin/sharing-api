interface BaseRepository<T, CreateDto, UpdateDto> {
    getAll: () => Promise<T[]>
    getById: (id: number | string) => Promise<T | null>
    create: (data: CreateDto) => Promise<T | null>
    update: (id: number | string, data: UpdateDto) => Promise<T | null>
    delete: (id: number | string) => Promise<T | null>
}