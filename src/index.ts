import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { apiRoutes } from "./routes";
import { errorPlugin } from "./libs/plugins";

const app = new Elysia();

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
