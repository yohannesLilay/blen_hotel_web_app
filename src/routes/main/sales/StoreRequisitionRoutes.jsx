import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const StoreRequisitions = Loadable(
  lazy(() => import("src/pages/sales/store-requisition/StoreRequisitions"))
);
const CreateStoreRequisition = Loadable(
  lazy(() => import("src/pages/sales/store-requisition/CreateStoreRequisition"))
);
const EditStoreRequisition = Loadable(
  lazy(() => import("src/pages/sales/store-requisition/EditStoreRequisition"))
);

const StoreRequisitionRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<StoreRequisitions />}
        requiredPermission={"view_store_requisition"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateStoreRequisition />}
        requiredPermission={"add_store_requisition"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditStoreRequisition />}
        requiredPermission={"change_store_requisition"}
      />
    ),
  },
];

export default StoreRequisitionRoutes;
