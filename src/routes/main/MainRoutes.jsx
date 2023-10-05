import { lazy } from "react";
import Loadable from "src/components/Loadable";
import MainLayout from "src/layout/MainLayout";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

/** Dashboard Routes */
const Dashboard = Loadable(lazy(() => import("src/pages/Dashboard")));

/** Routes*/
import PermissionRoutes from "./security/PermissionRoutes";
import RoleRoutes from "./security/RoleRoutes";
import UserRoutes from "./security/UserRoutes";
import CategoryRoutes from "./configurations/CategoryRoutes";
import ProductRoutes from "./configurations/ProductRoutes";
import SupplierRoutes from "./configurations/SupplierRoutes";
import CompanyRoutes from "./configurations/CompanyRoutes";
import OrderRoutes from "./purchases/OrderRoutes";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { path: "dashboard", element: <PrivateRoute element={<Dashboard />} /> },
    { path: "permissions", children: [PermissionRoutes] },
    { path: "roles", children: [...RoleRoutes] },
    { path: "users", children: [...UserRoutes] },
    { path: "categories", children: [...CategoryRoutes] },
    { path: "products", children: [...ProductRoutes] },
    { path: "suppliers", children: [...SupplierRoutes] },
    { path: "companies", children: [...CompanyRoutes] },
    { path: "purchases/orders", children: [...OrderRoutes] },
  ],
};

export default MainRoutes;
