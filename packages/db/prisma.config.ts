import "dotenv/config";
import { defineConfig } from "prisma/config";

const DEFAULT_DEV_DATABASE_URL = "postgresql://localhost:5432/devforge";

const databaseUrl = process.env.DATABASE_URL ?? DEFAULT_DEV_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});
