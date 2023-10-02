import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Inventories = Loadable(
  lazy(() => import("src/pages/configurations/inventory/Inventories"))
);
const CreateInventory = Loadable(
  lazy(() => import("src/pages/configurations/inventory/CreateInventory"))
);
const EditInventory = Loadable(
  lazy(() => import("src/pages/configurations/inventory/EditInventory"))
);

const InventoryRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Inventories />}
        requiredPermission={"view_inventory"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateInventory />}
        requiredPermission={"add_inventory"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditInventory />}
        requiredPermission={"change_inventory"}
      />
    ),
  },
];

export default InventoryRoutes;
