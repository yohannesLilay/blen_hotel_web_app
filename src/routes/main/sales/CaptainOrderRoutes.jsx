import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const CaptainOrders = Loadable(
  lazy(() => import("src/pages/sales/captain-order/CaptainOrders"))
);
const CreateCaptainOrder = Loadable(
  lazy(() => import("src/pages/sales/captain-order/CreateCaptainOrder"))
);
const EditCaptainOrder = Loadable(
  lazy(() => import("src/pages/sales/captain-order/EditCaptainOrder"))
);

const CaptainOrderRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<CaptainOrders />}
        requiredPermission={"view_captain_order"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateCaptainOrder />}
        requiredPermission={"add_captain_order"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditCaptainOrder />}
        requiredPermission={"change_captain_order"}
      />
    ),
  },
];

export default CaptainOrderRoutes;
