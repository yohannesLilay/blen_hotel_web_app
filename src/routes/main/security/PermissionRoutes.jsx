import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Permissions = Loadable(
  lazy(() => import("src/pages/security/permission/Permissions"))
);

const PermissionRoutes = {
  path: "",
  element: (
    <PrivateRoute
      element={<Permissions />}
      requiredPermission={"view_permission"}
    />
  ),
};

export default PermissionRoutes;
