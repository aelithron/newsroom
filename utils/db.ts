import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as main from "./schema/main";
import * as auth from "./schema/auth";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, relations: { ...main.relations, ...auth.authRelations } });