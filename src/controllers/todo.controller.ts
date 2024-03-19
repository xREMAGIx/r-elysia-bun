import { InvalidContentError } from "@/libs/error";
import { authenticatePlugin, queryPaginationPlugin } from "@/libs/plugins";
import {
  baseSelectTodoSchema,
  createTodoParamSchema,
  detailTodoDataSchema,
  listTodoDataSchema,
  todoModel,
  updateTodoParamSchema,
} from "@/models/todo.model";
import TodoService from "@/services/todo.service";
import { Elysia, t } from "elysia";

export const todoRoutes = new Elysia({ prefix: "api/v1" });

todoRoutes.group(
  `/todo`,
  {
    detail: {
      tags: ["Todo"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(todoModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, userId }) => {
          const data = await TodoService.create({ ...body, userId });

          return {
            data: data,
          };
        },
        {
          body: createTodoParamSchema,
          response: t.Object({
            data: baseSelectTodoSchema,
          }),
          detail: {
            summary: "Create Todo",
          },
        }
      )

      .guard(
        {
          params: t.Object({
            id: t.Numeric({
              error: "Invalid id param :<",
            }),
          }),
        },
        (innerApp) =>
          innerApp
            //* Detail
            .get(
              "/:id",
              async ({ params, error }) => {
                const { id } = params;
                const data = await TodoService.getDetail({ id });

                if (!data) {
                  throw error(404, "Not Found UwU");
                }

                return {
                  data,
                };
              },
              {
                response: detailTodoDataSchema,
                detail: {
                  summary: "Get Todo Detail",
                },
              }
            )
            //* Update
            .put(
              "/:id",
              async ({ params, body }) => {
                const { id } = params;

                const data = await TodoService.update({
                  id,
                  ...body,
                });

                return {
                  data,
                };
              },
              {
                body: updateTodoParamSchema,
                response: detailTodoDataSchema,
                detail: {
                  summary: "Update Todo",
                },
              }
            )
            //* Delete
            .delete(
              "/:id",
              ({ params }) => {
                const { id } = params;

                return TodoService.delete(id);
              },
              {
                response: t.Object({
                  id: t.Number(),
                }),
                detail: {
                  summary: "Delete Todo",
                },
              }
            )
      )

      //* List
      .use(queryPaginationPlugin)
      .get(
        "/",
        async ({ query: { sortBy = "desc", limit = 10, page = 1 } }) => {
          if (sortBy !== "asc" && sortBy !== "desc") {
            throw new InvalidContentError("Sortby not valid!");
          }

          return await TodoService.getList({
            sortBy: sortBy,
            limit: Number(limit),
            page: Number(page),
          });
        },
        {
          response: listTodoDataSchema,
          detail: {
            summary: "Get Todo List",
          },
        }
      )
);
