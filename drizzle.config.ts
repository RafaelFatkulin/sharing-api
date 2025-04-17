import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: ["./src/features/**/*.schema.ts"],
  dialect: "postgresql",
  breakpoints: false,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
