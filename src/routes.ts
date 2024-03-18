import { simpleTodoRoutes } from "./controllers/simple-todo.controller";
import { userRoutes } from "./controllers/user.controller";

export const routes = [
  {
    endpoints: simpleTodoRoutes,
  },
  {
    endpoints: userRoutes,
  },
];
