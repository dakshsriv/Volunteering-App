import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Allow builds to run without DATABASE_URL; runtime queries still require it.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/dummy",
  },
});