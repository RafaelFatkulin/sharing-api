import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "@core/core.errors";
import { trans } from "@core/locales";
import Elysia from "elysia";

const getErrorMessage = (error: Readonly<Error>, defaultMessage: string) => {
  return typeof error === "object" && error !== null && "message" in error
    ? (error as { message: string }).message
    : defaultMessage;
};

export const errorPlugin = new Elysia()
  .error({
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    BadRequestError,
  })
  .onError(({ error, code, set }) => {
    console.log({ error });

    if (code === "UnauthorizedError") {
      set.status = 401;

      const errorMessage = getErrorMessage(error, "Unauthorized");

      return {
        error: errorMessage,
      };
    }

    if (code === "ForbiddenError") {
      set.status = 403;

      const errorMessage = getErrorMessage(error, "Forbidden");

      return {
        error: errorMessage,
      };
    }

    if (code === "ConflictError") {
      set.status = 409;

      const errorMessage = getErrorMessage(error, "Unauthorized");

      return {
        error: errorMessage,
      };
    }

    if (code === "BadRequestError") {
      set.status = 500;

      const errorMessage = getErrorMessage(error, "Bad Request");

      return {
        error: errorMessage,
      };
    }

    if (code === "VALIDATION") {
      set.status = 400;

      const validationError = error as {
        all: Array<{
          path?: string;
          message: string;
        }>;
      };

      const details = validationError.all.reduce((acc, err) => {
        if (err.path) {
          const key = err.path.toString().split("/")[1] || "unknown";
          if (!acc[key]) acc[key] = [];
          acc[key].push(err.message);
        } else {
          if (!acc["unknown"]) acc["unknown"] = [];
          acc["unknown"].push(err.message);
        }
        return acc;
      }, {} as Record<string, string[]>);

      return {
        error: trans("errors.validation"),
        details,
      };
    }

    set.status =
      code === "NOT_FOUND" ? 404 : code === "INTERNAL_SERVER_ERROR" ? 500 : 500;

    const errorMessage = getErrorMessage(
      error as Error,
      "An unknown error occurred"
    );

    const response: Record<string, any> = {
      error: errorMessage,
    };

    if (process.env.NODE_ENV === "development") {
      if (typeof error === "object" && error !== null && "stack" in error) {
        response.stack = (error as { stack: string }).stack;
      }
    }

    return response;
  })
  .as("scoped");
