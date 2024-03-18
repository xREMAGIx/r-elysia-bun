import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { routes } from "./routes";

const app = new Elysia();

app.use(swagger());

for (let i = 0; i < routes.length; i++) {
  app.use(routes[i].endpoints);
}

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
