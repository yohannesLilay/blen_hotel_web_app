import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Users = Loadable(lazy(() => import("src/pages/security/user/Users")));
const CreateUser = Loadable(
  lazy(() => import("src/pages/security/user/CreateUser"))
);
const EditUser = Loadable(
  lazy(() => import("src/pages/security/user/EditUser"))
);

const UserRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute element={<Users />} requiredPermission={"view_user"} />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute element={<CreateUser />} requiredPermission={"add_user"} />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute element={<EditUser />} requiredPermission={"change_user"} />
    ),
  },
];

export default UserRoutes;
