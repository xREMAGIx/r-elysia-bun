import { Elysia, t } from "elysia";

export const queryPaginationSchema = t.Partial(
  t.Object({
    sortBy: t.String(),
    limit: t.Numeric(),
    page: t.Numeric(),
  })
);

export const metaPaginationSchema = t.Object({
  limit: t.Number(),
  page: t.Number(),
  total: t.Number(),
  totalPages: t.Number(),
});

export const queryPaginationModel = new Elysia().model({
  queryPagination: queryPaginationSchema,
  metaPagination: metaPaginationSchema,
});
