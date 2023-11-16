import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Menus = Loadable(
  lazy(() => import("src/pages/configurations/menu/Menus"))
);
const CreateMenu = Loadable(
  lazy(() => import("src/pages/configurations/menu/CreateMenu"))
);
const EditMenu = Loadable(
  lazy(() => import("src/pages/configurations/menu/EditMenu"))
);

const MenuRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute element={<Menus />} requiredPermission={"view_menu"} />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute element={<CreateMenu />} requiredPermission={"add_menu"} />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute element={<EditMenu />} requiredPermission={"change_menu"} />
    ),
  },
];

export default MenuRoutes;
