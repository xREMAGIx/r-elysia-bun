import { authRoutes } from "./controllers/auth.controller";
import { commonRoutes } from "./controllers/common.controller";
import { simpleTodoRoutes } from "./controllers/simple-todo.controller";
import { todoRoutes } from "./controllers/todo.controller";
import { userRoutes } from "./controllers/user.controller";

export const apiRoutes = [
  {
    endpoints: commonRoutes,
  },
  {
    endpoints: authRoutes,
  },
  {
    endpoints: simpleTodoRoutes,
  },
  {
    endpoints: todoRoutes,
  },
  {
    endpoints: userRoutes,
  },
];
