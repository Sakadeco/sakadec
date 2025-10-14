import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not found. Skipping database configuration.");
  console.warn("   To use database features, set DATABASE_URL environment variable.");
  process.exit(0);
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
