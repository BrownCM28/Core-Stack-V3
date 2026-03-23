import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Prisma CLI doesn't auto-load .env.local — load it manually
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
