import { lazy } from "react";
import Loadable from "src/components/Loadable";
import MainLayout from "src/layout/MainLayout";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

/** Dashboard Routes */
const Dashboard = Loadable(lazy(() => import("src/pages/Dashboard")));

/** Notification Routes */
const Notifications = Loadable(lazy(() => import("src/pages/Notifications")));

/** Routes*/
import PermissionRoutes from "./security/PermissionRoutes";
import RoleRoutes from "./security/RoleRoutes";
import UserRoutes from "./security/UserRoutes";
import SettingRoutes from "./settings/SettingRoutes";
import CategoryRoutes from "./product-management/CategoryRoutes";
import ProductRoutes from "./product-management/ProductRoutes";
import SupplierRoutes from "./configurations/SupplierRoutes";
import FacilityTypeRoutes from "./configurations/FacilityTypeRoutes";
import WorkFlowRoutes from "./configurations/WorkFlowRoutes";
import OrderRoutes from "./purchases/OrderRoutes";
import ReceivableRoutes from "./purchases/ReceivableRoutes";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { path: "dashboard", element: <PrivateRoute element={<Dashboard />} /> },
    {
      path: "notifications",
      element: <PrivateRoute element={<Notifications />} />,
    },
    { path: "permissions", children: [PermissionRoutes] },
    { path: "roles", children: [...RoleRoutes] },
    { path: "users", children: [...UserRoutes] },
    { path: "settings", children: [...SettingRoutes] },
    { path: "categories", children: [...CategoryRoutes] },
    { path: "products", children: [...ProductRoutes] },
    { path: "suppliers", children: [...SupplierRoutes] },
    { path: "work-flows", children: [...WorkFlowRoutes] },
    { path: "facility-types", children: [...FacilityTypeRoutes] },
    { path: "purchases/orders", children: [...OrderRoutes] },
    { path: "purchases/receivables", children: [...ReceivableRoutes] },
  ],
};

export default MainRoutes;
