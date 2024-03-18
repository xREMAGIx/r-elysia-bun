import { simpleTodoTable } from "@/db-schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Elysia, t } from "elysia";
import { metaPaginationSchema } from "./base";

export const selectSimpleTodoSchema = createSelectSchema(simpleTodoTable);

export const baseInsertSimpleTodoSchema = createInsertSchema(simpleTodoTable);

export const insertSimpleTodoSchema = t.Omit(baseInsertSimpleTodoSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

//* Model
export const simpleTodoModel = new Elysia().model({
  "simpleTodo.data": selectSimpleTodoSchema,
  "simpleTodo.list": t.Object({
    data: t.Array(selectSimpleTodoSchema),
    meta: metaPaginationSchema,
  }),
  "simpleTodo.detail": t.Object({
    data: selectSimpleTodoSchema,
  }),
});
