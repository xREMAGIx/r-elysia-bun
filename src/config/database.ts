import * as schema from "@/db-schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

export const db = drizzle(pool, { schema: { ...schema } });

const extractDB = () => {
  return db;
};

export type DBType = ReturnType<typeof extractDB>;
