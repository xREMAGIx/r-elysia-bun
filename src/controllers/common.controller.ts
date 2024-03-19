import { Elysia } from "elysia";

export const commonRoutes = new Elysia({ prefix: "api/common" });

commonRoutes.group(
  `/file`,
  {
    detail: {
      tags: ["File"],
    },
  },
  (app) =>
    app
      .post("/chunk", () => "List", {
        detail: {
          summary: "Chunk File",
        },
      })
      .post("/merge", () => "Create", {
        detail: {
          summary: "Merge File",
        },
      })
);
