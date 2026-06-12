import "dotenv/config";
import { defineConfig } from "prisma/config";

// Fallback used for Prisma client generation when DATABASE_URL is not configured.
// Developers should set DATABASE_URL in their environment for real database operations.
const DEFAULT_DATABASE_URL = "postgresql://localhost:5432/devforge";

const databaseUrl = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});
