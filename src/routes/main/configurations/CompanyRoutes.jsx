import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Companies = Loadable(
  lazy(() => import("src/pages/configurations/company/Companies"))
);
const CreateCompany = Loadable(
  lazy(() => import("src/pages/configurations/company/CreateCompany"))
);
const EditCompany = Loadable(
  lazy(() => import("src/pages/configurations/company/EditCompany"))
);

const CompanyRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Companies />}
        requiredPermission={"view_company"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateCompany />}
        requiredPermission={"add_company"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditCompany />}
        requiredPermission={"change_company"}
      />
    ),
  },
];

export default CompanyRoutes;
