import { env } from "bun";

export const serverConfig = {
  port: env.PORT || 3000,
  env: env.NODE_ENV || "development",
};

export const jwtConfig = {
  secret: env.JWT_SECRET!,
  refreshSecret: env.JWT_REFRESH_SECRET!,
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
};

if (serverConfig.env === "development") {
  const requiredVars = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

  for (const requiredVar of requiredVars) {
    if (!env[requiredVar]) {
      console.warn(`⚠️ Переменная ${requiredVar} не определена в .env!`);
    }
  }
}
