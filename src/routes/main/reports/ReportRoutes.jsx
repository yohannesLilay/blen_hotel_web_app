import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Reports = Loadable(lazy(() => import("src/pages/reports/Reports")));
const ProductSalesReport = Loadable(
  lazy(() => import("src/pages/reports/ProductSalesReport"))
);
const RoomRevenueReport = Loadable(
  lazy(() => import("src/pages/reports/RoomRevenueReport"))
);
const SalesByStaffReport = Loadable(
  lazy(() => import("src/pages/reports/SalesByStaffReport"))
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
  {
    path: "room-revenue-report",
    element: (
      <PrivateRoute
        element={<RoomRevenueReport />}
        requiredPermission={"view_room_revenue_report"}
      />
    ),
  },
  {
    path: "sales-by-staff-report",
    element: (
      <PrivateRoute
        element={<SalesByStaffReport />}
        requiredPermission={"view_sales_by_staff_report"}
      />
    ),
  },
];

export default ReportRoutes;
