import { todoTable } from "@/db-schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Elysia, Static, t } from "elysia";
import { metaPaginationSchema } from "./base";

export const baseSelectTodoSchema = createSelectSchema(todoTable);

export const baseInsertTodoSchema = createInsertSchema(todoTable);

export const listTodoDataSchema = t.Object({
  data: t.Array(baseSelectTodoSchema),
  meta: metaPaginationSchema,
});

export const detailTodoDataSchema = t.Object({
  data: baseSelectTodoSchema,
});

export const createTodoParamSchema = t.Omit(baseInsertTodoSchema, [
  "id",
  "userId",
  "createdAt",
  "updatedAt",
]);

export const updateTodoParamSchema = t.Omit(baseInsertTodoSchema, [
  "id",
  "userId",
  "createdAt",
  "updatedAt",
]);

export type GetDetailTodoParams = {
  id: number;
};

export type CreateTodoParams = Static<typeof createTodoParamSchema> & {
  userId: number;
};
export type UpdateTodoParams = Static<typeof updateTodoParamSchema> & {
  id: number;
};

//* Model
export const todoModel = new Elysia().model({
  "todo.data": baseSelectTodoSchema,
});
