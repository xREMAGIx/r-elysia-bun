import { Elysia, Static, t } from "elysia";

export const chunkFileParamSchema = t.Object(
  {
    fileUuid: t.String(),
    fileIndex: t.Numeric(),
    file: t.File(),
  },
  {
    additionalProperties: true,
  }
);

export const mergeFileParamSchema = t.Object({
  fileUuid: t.String(),
  fileName: t.String(),
});

export type ChunkFileParams = Static<typeof chunkFileParamSchema>;
export type MergeFileParams = Static<typeof mergeFileParamSchema>;

//* Model
export const commonModel = new Elysia().model({
  "chunk-file.params": chunkFileParamSchema,
  "merge-file.params": mergeFileParamSchema,
});
