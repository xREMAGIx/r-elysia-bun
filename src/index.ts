import cors from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { errorPlugin } from "./libs/plugins";
import { apiRoutes } from "./routes";

const intialApp = new Elysia({ name: "root" })
  .use(cors())
  .use(
    swagger({
      path: "/documentation",
      documentation: {
        components: {
          securitySchemes: {
            JwtAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Enter JWT Bearer token **_only_**",
            },
          },
        },
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(staticPlugin())
  .use(errorPlugin);

const app = [...apiRoutes]
  .reduce((prevVal, currValue) => {
    return prevVal.use(currValue.endpoints);
  }, intialApp)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
