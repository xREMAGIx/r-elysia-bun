import { authenticatePlugin, tokenPlugin } from "@/libs/plugins";
import {
  authModel,
  getProfileDataSchema,
  loginDataSchema,
  loginParamsSchema,
  registerDataSchema,
  registerParamsSchema,
} from "@/models/auth.model";
import AuthService from "@/services/auth.service";
import dayjs from "dayjs";
import { Elysia } from "elysia";

export const authRoutes = new Elysia({ prefix: "api/v1" });

authRoutes.group(
  `/auth`,
  {
    detail: {
      tags: ["Auth"],
    },
  },
  (app) =>
    app
      .use(authModel)
      .use(tokenPlugin)
      //* Login
      .post(
        "/login",
        async ({ body, accessJwt, refreshJwt }) => {
          const { email, password } = body;

          const result = await AuthService.login({
            email,
            password,
          });

          const accessToken = await accessJwt.sign({
            sub: result.id.toString(),
            iat: dayjs().unix(),
            type: "access",
            role: result.role.toString(),
          });

          const refreshToken = await refreshJwt.sign({
            sub: result.id.toString(),
            iat: dayjs().unix(),
            type: "access",
            role: result.role.toString(),
          });

          return {
            user: result,
            tokens: {
              access: accessToken,
              refresh: refreshToken,
            },
          };
        },
        {
          body: loginParamsSchema,
          response: loginDataSchema,
          detail: {
            summary: "Login",
          },
        }
      )

      //* Register
      .post(
        "/register",
        async ({ body }) => {
          const { username, email, password } = body;
          const result = await AuthService.register({
            username,
            email,
            password,
          });

          return {
            data: result,
          };
        },
        {
          body: registerParamsSchema,
          response: registerDataSchema,
          detail: {
            summary: "Register",
          },
        }
      )

      .use(authenticatePlugin)
      //* Profile
      .get(
        "/profile",
        async ({ userId }) => {
          const result = await AuthService.getProfile({
            userId: userId,
          });

          return {
            data: result,
          };
        },
        {
          response: getProfileDataSchema,
          detail: {
            summary: "Get Profile",
            security: [{ JwtAuth: [] }],
          },
        }
      )
);
