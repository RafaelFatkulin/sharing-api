import { trans } from "@core/locales";
import Elysia from "elysia";

export const responsePlugin = new Elysia()
    .mapResponse(({ request, response, set }) => {
        if (new URL(request.url).pathname.startsWith("/swagger")) {
            return response as Response;
        }

        if (response === null || response === undefined) {
            return new Response(
                JSON.stringify({
                    data: null,
                    message: trans("errors.no-content"),
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 204,
                }
            );
        }

        if (typeof response === "object" && !Array.isArray(response)) {
            if ("error" in response || "details" in response || "cause" in response) {
                const errorResponse = {
                    details: "details" in response ? response.details : undefined,
                    cause: "cause" in response ? response.cause : undefined,
                    error: "error" in response ? response.error : "An error occurred",
                };

                const statusCode =
                    typeof set.status === "string"
                        ? parseInt(set.status, 10) || 500
                        : set.status || 500;

                return new Response(JSON.stringify(errorResponse), {
                    headers: { "Content-Type": "application/json" },
                    status: statusCode,
                });
            }
        }

        let message = "Success";
        let data = response;

        if (typeof response === "object" && !Array.isArray(response)) {
            if ("message" in response) {
                const { message: _, ...rest } = response;
                data = rest;
            }
        }

        const wrappedResponse = {
            data,
            message,
        };

        const statusCode =
            typeof set.status === "string"
                ? parseInt(set.status, 10) || 200
                : set.status || 200;

        return new Response(JSON.stringify(wrappedResponse), {
            headers: { "Content-Type": "application/json" },
            status: statusCode,
        });
    }).as('scoped')