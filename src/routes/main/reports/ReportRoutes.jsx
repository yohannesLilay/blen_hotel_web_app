import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Reports = Loadable(lazy(() => import("src/pages/reports/Reports")));
const ProductSalesReport = Loadable(
  lazy(() => import("src/pages/reports/ProductSalesReport"))
);

const ReportRoutes = [
  {
    path: "",
    element: <PrivateRoute element={<Reports />} />,
  },
  {
    path: "product-sales-report",
    element: (
      <PrivateRoute
        element={<ProductSalesReport />}
        requiredPermission={"view_product_sales_report"}
      />
    ),
  },
];

export default ReportRoutes;
