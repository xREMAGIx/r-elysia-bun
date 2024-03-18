import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pool } from './database';

await migrate(db, { migrationsFolder: "./drizzle" });

console.log(
    `🦊 Migrate completed!`
);

await pool.end();