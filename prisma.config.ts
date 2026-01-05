import config  from "./src/utils/env";
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: config.DATABASE_URL!
  },
});
