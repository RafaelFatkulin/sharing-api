import Elysia from "elysia";

export class UnauthorizedError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
