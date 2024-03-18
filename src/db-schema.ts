import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const simpleTodoTable = pgTable("simple_todo", {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    name: text("name").notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
});
