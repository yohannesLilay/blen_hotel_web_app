import { lazy } from "react";
import Loadable from "src/components/Loadable";
import MinimalLayout from "src/layout/MinimalLayout";

//Pages
const AuthLogin = Loadable(
  lazy(() => import("src/pages/authentication/Login"))
);

const AuthRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "login",
      element: <AuthLogin />,
    },
  ],
};

export default AuthRoutes;
