interface BaseRepository<T, CreateDto, UpdateDto> {
    getAll: () => Promise<T[]>
    getById: (id: number) => Promise<T | null>
    create: (data: CreateDto) => Promise<T | null>
    update: (id: number, data: UpdateDto) => Promise<T | null>
    delete: (id: number) => Promise<T | null>
}