import { userTable } from "@/db-schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Elysia, Static, t } from "elysia";

export const baseSelectAuthSchema = createSelectSchema(userTable);

export const selectAuthSchema = t.Omit(baseSelectAuthSchema, ["password"]);

export const baseInsertAuthSchema = createInsertSchema(userTable);

export const insertAuthSchema = t.Omit(baseInsertAuthSchema, [
  "id",
  "role",
  "createdAt",
  "updatedAt",
]);

export const tokensAuthSchema = t.Object({
  access: t.String(),
  refresh: t.String(),
});

export const loginParamsSchema = t.Omit(insertAuthSchema, ["username"]);

export const loginDataSchema = t.Object({
  user: selectAuthSchema,
  tokens: tokensAuthSchema,
});

export const registerParamsSchema = insertAuthSchema;

export const registerDataSchema = t.Object({
  data: selectAuthSchema,
});

export const getProfileDataSchema = t.Object({
  data: selectAuthSchema,
});

export type LoginParams = Static<typeof loginParamsSchema>;
export type RegisterParams = Static<typeof registerParamsSchema>;
export type UserData = Static<typeof baseSelectAuthSchema>;
export type AuthData = Static<typeof selectAuthSchema>;
export type GetProfileParams = { userId: number };

//* Model
export const authModel = new Elysia().model({
  "auth.user": selectAuthSchema,
  "auth.token": tokensAuthSchema,
});
