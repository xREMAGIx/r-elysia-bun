import { queryPaginationModel } from "@/models/base";
import { Elysia } from "elysia";

//* Database

//* Plugins

export const queryPaginationPlugin = new Elysia()
    .use(queryPaginationModel)
    .guard({
        query: "queryPagination",
    });
