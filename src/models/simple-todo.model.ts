import { simpleTodoTable } from "@/db-schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Elysia, Static, t } from "elysia";
import { metaPaginationSchema } from "./base";
import { updateTodoParamSchema } from "./todo.model";

export const selectSimpleTodoSchema = createSelectSchema(simpleTodoTable);

export const baseInsertSimpleTodoSchema = createInsertSchema(simpleTodoTable);

export const insertSimpleTodoSchema = t.Omit(baseInsertSimpleTodoSchema, [
  "id",
  "createdAt",
  "updatedAt",
]);

export const listSimpleTodoDataSchema = t.Object({
  data: t.Array(selectSimpleTodoSchema),
  meta: metaPaginationSchema,
});

export const detailSimpleTodoDataSchema = t.Object({
  data: selectSimpleTodoSchema,
});

export type GetDetailSimpleTodoParams = {
  id: number;
};

export type CreateSimpleTodoParams = Static<typeof insertSimpleTodoSchema>;
export type UpdateSimpleTodoParams = Static<typeof updateTodoParamSchema> & {
  id: number;
};

//* Model
export const simpleTodoModel = new Elysia().model({
  "simpleTodo.data": selectSimpleTodoSchema,
});
