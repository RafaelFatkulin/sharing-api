import { Elysia } from "elysia";
import { serverConfig } from "@core/config";
import swagger from "@elysiajs/swagger";
import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "@core/core.errors";
import { usersRoute } from "@features/users/users.route";

new Elysia()
  .use(swagger())
  .error({
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
  })
  .onError(({ error, code, set }) => {
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
        error: "Validation failed",
        details,
      };
    }

    set.status =
      code === "NOT_FOUND" ? 404 : code === "INTERNAL_SERVER_ERROR" ? 500 : 500;

    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : "An unknown error occurred";

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
  .mapResponse(({ response, set }) => {
    if (response === null || response === undefined) {
      return new Response(
        JSON.stringify({
          data: null,
          message: "No content",
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 204,
        }
      );
    }

    let message = "Success";
    let data = response;

    if (typeof response === "object" && !Array.isArray(response)) {
      if ("message" in response) {
        message = response.message as string;
        // Remove message from data to avoid duplication
        const { message: _, ...rest } = response;
        data = rest;
      }
    }

    const wrappedResponse = {
      data,
      message,
      timestamp: new Date().toISOString(),
    };

    const statusCode =
      typeof set.status === "string"
        ? parseInt(set.status, 10) || 200
        : set.status || 200;

    return new Response(JSON.stringify(wrappedResponse), {
      headers: { "Content-Type": "application/json" },
      status: statusCode,
    });
  })
  .use(usersRoute)
  .listen(serverConfig.port);
