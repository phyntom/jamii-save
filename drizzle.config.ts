import dotenv from "dotenv";

dotenv.config();

import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schemas/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "migrations-table",
    schema: "jamii",
  },
}) satisfies Config;
