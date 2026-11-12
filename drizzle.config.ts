import "dotenv/config";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: "./drizzle",
  schema: './utils/schema',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
