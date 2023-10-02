import { useRoutes, Navigate } from "react-router-dom";

import AuthRoutes from "./auth/AuthRoutes";
import MainRoutes from "./main/MainRoutes";
import NotFound from "src/pages/errors/NotFound";

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <Navigate to="/dashboard" />,
    },
    AuthRoutes,
    MainRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
