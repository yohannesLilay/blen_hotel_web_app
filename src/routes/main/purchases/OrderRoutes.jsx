import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Orders = Loadable(lazy(() => import("src/pages/purchases/order/Orders")));
const CreateOrder = Loadable(
  lazy(() => import("src/pages/purchases/order/CreateOrder"))
);
const EditOrder = Loadable(
  lazy(() => import("src/pages/purchases/order/EditOrder"))
);

const OrderRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Orders />}
        requiredPermission={"view_purchase_order"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateOrder />}
        requiredPermission={"add_purchase_order"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditOrder />}
        requiredPermission={"change_purchase_order"}
      />
    ),
  },
];

export default OrderRoutes;
