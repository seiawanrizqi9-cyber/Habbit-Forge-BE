import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
  ...(process.env.DATABASE_URL?.includes("railway") && {
    datasource: {
      url: env("DATABASE_URL") + "?sslmode=no-verify&connect_timeout=30",
    },
  }),
});