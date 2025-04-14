export class UnauthorizedError extends Error {
    constructor(public message: string) {
        super(message)
    };
}

export class ForbiddenError extends Error {
    code: 'FORBIDDEN' = 'FORBIDDEN'
    status: 403 = 403
    constructor(message?: string) {
        super(message)
        this.name = 'ForbiddenError'
    };
}
