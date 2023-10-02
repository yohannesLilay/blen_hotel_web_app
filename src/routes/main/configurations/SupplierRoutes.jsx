import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Suppliers = Loadable(
  lazy(() => import("src/pages/configurations/supplier/Suppliers"))
);
const CreateSupplier = Loadable(
  lazy(() => import("src/pages/configurations/supplier/CreateSupplier"))
);
const EditSupplier = Loadable(
  lazy(() => import("src/pages/configurations/supplier/EditSupplier"))
);

const SupplierRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Suppliers />}
        requiredPermission={"view_supplier"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateSupplier />}
        requiredPermission={"add_supplier"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditSupplier />}
        requiredPermission={"change_supplier"}
      />
    ),
  },
];

export default SupplierRoutes;
