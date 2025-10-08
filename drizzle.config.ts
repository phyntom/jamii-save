import dotenv from "dotenv"
dotenv.config()
import { defineConfig } from "drizzle-kit";
import { Config } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect:'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "jamii-migrations-table",
    schema: "jamii",
  },
}) satisfies Config;