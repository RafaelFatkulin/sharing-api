export const TAGS = ['Users']
export const PATHS = {
    root: '/users',
    id: () => PATHS.root.concat('/{id}'),
    create: () => PATHS.root.concat('/create'),
    update: () => PATHS.root.concat('/update'),
    remove: () => PATHS.root.concat('/delete')
}