import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { errorPlugin } from "./libs/plugins";
import { apiRoutes } from "./routes";

const app = new Elysia();

app.use(cors());

app.use(
  swagger({
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
);
app.use(errorPlugin);

for (let i = 0; i < apiRoutes.length; i++) {
  app.use(apiRoutes[i].endpoints);
}

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
