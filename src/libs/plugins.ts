import { queryPaginationModel } from "@/models/base";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import * as CustomError from "./error";

//* Plugins
export const tokenPlugin = new Elysia({ name: "token-plugin" })
  .use(
    jwt({
      name: "accessJwt",
      secret: process.env.JWT_SECRET ?? "iamasecret",
      exp: process.env.JWT_ACCESS_EXPIRATION ?? "1h",
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: process.env.JWT_SECRET ?? "iamasecret",
      exp: process.env.JWT_REFRESH_EXPIRATION ?? "30d",
    })
  );

export const authenticatePlugin = new Elysia({ name: "authenticate-plugin" })
  .use(tokenPlugin)
  .use(bearer())
  .onBeforeHandle({ as: "global" }, ({ bearer }) => {
    if (!bearer) {
      throw new CustomError.UnauthorizedError("Unauthorized!");
    }
  })
  .resolve({ as: "global" }, async ({ bearer, accessJwt }) => {
    const data = await accessJwt.verify(bearer);

    if (!data) {
      throw new CustomError.UnauthorizedError("Invalid token!");
    }

    if (!data["sub"]) {
      throw new CustomError.UnauthorizedError("Invalid authorized data!");
    }

    return {
      userId: Number(data["sub"]),
    };
  });

export const errorPlugin = new Elysia({ name: "error-plugin" })
  .error({
    ...CustomError,
  })
  .onError({ as: "scoped" }, ({ code, error, set }) => {
    switch (code) {
      case "InvalidContentError":
        set.status = 422;

        return {
          code: 422,
          error: error.message,
        };

      case "UnauthorizedError":
        set.status = error.statusCode;

        return {
          code: error.statusCode,
          error: error.message,
        };
    }
  });

export const queryPaginationPlugin = new Elysia()
  .use(queryPaginationModel)
  .guard({
    query: "queryPagination",
  });
