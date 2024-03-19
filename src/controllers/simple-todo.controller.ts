import { InvalidContentError } from "@/libs/error";
import { queryPaginationPlugin } from "@/libs/plugins";
import {
  detailSimpleTodoDataSchema,
  insertSimpleTodoSchema,
  listSimpleTodoDataSchema,
  simpleTodoModel,
} from "@/models/simple-todo.model";
import SimpleTodoService from "@/services/simple-todo.service";
import { Elysia, t } from "elysia";

export const simpleTodoRoutes = new Elysia({ prefix: "api/v1" });

simpleTodoRoutes.group(
  `/simple-todo`,
  {
    detail: {
      tags: ["Simple Todo"],
    },
  },
  (app) =>
    app
      .use(simpleTodoModel)

      //* Create
      .post(
        "/",
        async ({ body }) => {
          const { name, isCompleted } = body;
          const data = await SimpleTodoService.create({
            name: name,
            isCompleted: isCompleted ?? false,
          });

          return {
            data: data,
          };
        },
        {
          body: insertSimpleTodoSchema,
          response: detailSimpleTodoDataSchema,
          detail: {
            summary: "Create Simple Todo",
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
                const data = await SimpleTodoService.getDetail({ id });

                if (!data) {
                  throw error(404, "Not Found UwU");
                }

                return {
                  data,
                };
              },
              {
                response: detailSimpleTodoDataSchema,
                detail: {
                  summary: "Get Simple Todo Detail",
                },
              }
            )
            //* Update
            .put(
              "/:id",
              async ({ params, body }) => {
                const { id } = params;
                const { name, isCompleted } = body;

                const data = await SimpleTodoService.update({
                  id,
                  name,
                  isCompleted: isCompleted ?? false,
                });

                return {
                  data,
                };
              },
              {
                body: insertSimpleTodoSchema,
                response: detailSimpleTodoDataSchema,
                detail: {
                  summary: "Update Simple Todo",
                },
              }
            )
            //* Delete
            .delete(
              "/:id",
              ({ params }) => {
                const { id } = params;

                return SimpleTodoService.delete(id);
              },
              {
                response: t.Object({
                  id: t.Number(),
                }),
                detail: {
                  summary: "Delete Simple Todo",
                },
              }
            )
      )

      //* List
      .use(queryPaginationPlugin)
      .get(
        "/",
        async ({ query: { sortBy = "desc", limit, page } }) => {
          if (sortBy !== "asc" && sortBy !== "desc") {
            throw new InvalidContentError("Sortby not valid!");
          }

          return await SimpleTodoService.getList({
            sortBy: sortBy ?? "asc",
            limit: Number(limit),
            page: Number(page),
          });
        },
        {
          response: listSimpleTodoDataSchema,
          detail: {
            summary: "Get Simple Todo List",
          },
        }
      )
);
