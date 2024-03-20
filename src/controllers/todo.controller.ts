import { InvalidContentError } from "@/libs/error";
import {
  authenticatePlugin,
  databasePlugin,
  queryPaginationPlugin,
} from "@/libs/plugins";
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

export const todoRoutes = new Elysia({
  name: "todo",
}).group(
  `api/v1/todo`,
  {
    detail: {
      tags: ["Todo"],
      security: [{ JwtAuth: [] }],
    },
  },
  (app) =>
    app
      .use(databasePlugin)
      .derive(({ db }) => {
        return {
          service: new TodoService(db),
        };
      })
      .use(todoModel)
      .use(authenticatePlugin)
      //* Create
      .post(
        "/",
        async ({ body, userId, service }) => {
          const data = await service.create({ ...body, userId });

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
              async ({ params, error, service }) => {
                const { id } = params;
                const data = await service.getDetail({ id });

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
              async ({ params, body, service }) => {
                const { id } = params;

                const data = await service.update({
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
              ({ params, service }) => {
                const { id } = params;

                return service.delete(id);
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
        async ({
          query: { sortBy = "desc", limit = 10, page = 1 },
          service,
        }) => {
          if (sortBy !== "asc" && sortBy !== "desc") {
            throw new InvalidContentError("Sortby not valid!");
          }

          return await service.getList({
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
