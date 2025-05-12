import { Elysia } from "elysia";
import { serverConfig } from "@core/config";
import { core } from "@core/index";
import { usersRoute } from "@features/users/users.route";
import { authRoute } from "@features/auth/auth.route";
import swagger from "@elysiajs/swagger";
import { renterProfilesRoute } from "@features/renter-profile/renter-profile.route";
import { categoriesRoute } from "@features/category/category.route";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3000", // Allow requests from this origin
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers,
      credentials: true, // Allow credentials (e.g., cookies, authorization headers)
      preflight: true,
    })
  )
  .get("/", () => "hello")
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .use(core)
  .use(usersRoute)
  .use(authRoute)
  .use(renterProfilesRoute)
  .use(categoriesRoute);

const startServer = async () => {
  try {
    app.listen(serverConfig.port, ({ hostname, port }) => {
      console.info(`🦊 Server running at http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
