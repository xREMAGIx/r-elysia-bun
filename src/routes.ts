import { authRoutes } from "./controllers/auth.controller";
import { simpleTodoRoutes } from "./controllers/simple-todo.controller";
import { userRoutes } from "./controllers/user.controller";

export const apiRoutes = [
  {
    endpoints: authRoutes,
  },
  {
    endpoints: simpleTodoRoutes,
  },
  {
    endpoints: userRoutes,
  },
];
