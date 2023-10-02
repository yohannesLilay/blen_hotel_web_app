import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Roles = Loadable(lazy(() => import("src/pages/security/role/Roles")));
const CreateRole = Loadable(
  lazy(() => import("src/pages/security/role/CreateRole"))
);
const EditRole = Loadable(
  lazy(() => import("src/pages/security/role/EditRole"))
);

const RoleRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute element={<Roles />} requiredPermission={"view_role"} />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute element={<CreateRole />} requiredPermission={"add_role"} />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute element={<EditRole />} requiredPermission={"change_role"} />
    ),
  },
];

export default RoleRoutes;
