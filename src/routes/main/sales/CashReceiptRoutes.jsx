import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const CashReceipts = Loadable(
  lazy(() => import("src/pages/sales/cash-receipt/CashReceipts"))
);
const CreateCashReceipt = Loadable(
  lazy(() => import("src/pages/sales/cash-receipt/CreateCashReceipt"))
);

const CashReceiptRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<CashReceipts />}
        requiredPermission={"view_cash_receipt"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateCashReceipt />}
        requiredPermission={"add_cash_receipt"}
      />
    ),
  },
];

export default CashReceiptRoutes;
