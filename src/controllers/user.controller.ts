import { Elysia } from "elysia";

export const userRoutes = new Elysia({ prefix: "v1" });

userRoutes.group(
  `/user`,
  {
    detail: {
      tags: ["User"],
    },
  },
  (app) =>
    app
      .get("/", () => "List")
      .get("/:id", ({ params: { id } }) => "Detail: " + id)
      .post("/", () => "Create")
      .put("/", () => "Update")
      .delete("/:id", ({ params: { id } }) => "Delete: " + id)
);
