import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const simpleTodoTable = pgTable("simple_todo", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  name: text("name").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const todoTable = pgTable("todo", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

export const todoImgsTable = pgTable("todo_imgs", {
  id: serial("id").primaryKey(),
  todoId: integer("todo_id")
    .references(() => todoTable.id)
    .notNull(),
  path: text("path"),
});
