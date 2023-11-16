import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Staffs = Loadable(
  lazy(() => import("src/pages/configurations/staff/Staffs"))
);
const CreateStaff = Loadable(
  lazy(() => import("src/pages/configurations/staff/CreateStaff"))
);
const EditStaff = Loadable(
  lazy(() => import("src/pages/configurations/staff/EditStaff"))
);

const StaffRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute element={<Staffs />} requiredPermission={"view_staff"} />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateStaff />}
        requiredPermission={"add_staff"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditStaff />}
        requiredPermission={"change_staff"}
      />
    ),
  },
];

export default StaffRoutes;
