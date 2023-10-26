import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Receivables = Loadable(
  lazy(() => import("src/pages/purchases/receivable/Receivables"))
);
const CreateReceivable = Loadable(
  lazy(() => import("src/pages/purchases/receivable/CreateReceivable"))
);
const EditReceivable = Loadable(
  lazy(() => import("src/pages/purchases/receivable/EditReceivable"))
);

const ReceivableRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Receivables />}
        requiredPermission={"view_purchase_receivable"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateReceivable />}
        requiredPermission={"add_purchase_receivable"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditReceivable />}
        requiredPermission={"change_purchase_receivable"}
      />
    ),
  },
];

export default ReceivableRoutes;
