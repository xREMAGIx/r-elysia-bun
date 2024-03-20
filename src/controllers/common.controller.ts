import { commonModel } from "@/models/common.model";
import CommonService from "@/services/common.service";
import { Elysia, t } from "elysia";

export const commonRoutes = new Elysia({
  prefix: "api/common",
  name: "common",
})
  .use(commonModel)
  .group(
    `/file`,
    {
      detail: {
        tags: ["File"],
      },
    },
    (app) =>
      app
        .post(
          "/chunk",
          async ({ body }) => {
            await CommonService.storeChunk(body);
            return {
              success: true,
            };
          },
          {
            body: "chunk-file.params",
            response: t.Object({
              success: t.Boolean(),
            }),
            detail: {
              summary: "Chunk File",
            },
          }
        )
        .post(
          "/merge",
          async ({ body }) => {
            await CommonService.mergeChunk(body);
            return {
              success: true,
            };
          },
          {
            body: "merge-file.params",
            response: t.Object({
              success: t.Boolean(),
            }),
            detail: {
              summary: "Merge File",
            },
          }
        )
  );
