import { InvalidContentError } from "@/libs/error";
import {
  databasePlugin,
  idValidatePlugin,
  queryPaginationPlugin,
} from "@/libs/plugins";
import {
  detailSimpleTodoDataSchema,
  insertSimpleTodoSchema,
  listSimpleTodoDataSchema,
  simpleTodoModel,
} from "@/models/simple-todo.model";
import SimpleTodoService from "@/services/simple-todo.service";
import { Elysia, t } from "elysia";

export const simpleTodoRoutes = new Elysia({ name: "simple_todo" }).group(
  `api/v1/simple-todo`,
  {
    detail: {
      tags: ["Simple Todo"],
    },
  },
  (app) =>
    app
      .use(databasePlugin)
      .derive(({ db }) => {
        return {
          service: new SimpleTodoService(db),
        };
      })
      .use(simpleTodoModel)
      //* Create
      .post(
        "/",
        async ({ body, service }) => {
          const { name, isCompleted } = body;
          const data = await service.create({
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

      //* List
      .guard((innerApp) =>
        innerApp.use(queryPaginationPlugin).get(
          "/",
          async ({
            query: { sortBy = "desc", limit = "10", page = "1" },
            service,
          }) => {
            if (sortBy !== "asc" && sortBy !== "desc") {
              throw new InvalidContentError("Sortby not valid!");
            }

            return await service.getList({
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
      )

      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Detail
          .get(
            "/:id",
            async ({ idParams, error, service }) => {
              const data = await service.getDetail({ id: idParams });

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
            async ({ idParams, body, service }) => {
              const { name, isCompleted } = body;

              const data = await service.update({
                id: idParams,
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
            ({ idParams, service }) => {
              return service.delete(idParams);
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
);
