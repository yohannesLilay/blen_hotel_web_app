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
import InventoryRoutes from "./configurations/InventoryRoutes";
import SupplierRoutes from "./configurations/SupplierRoutes";
import CompanyRoutes from "./configurations/CompanyRoutes";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { path: "dashboard", element: <PrivateRoute element={<Dashboard />} /> },
    { path: "permissions", children: [PermissionRoutes] },
    { path: "roles", children: [...RoleRoutes] },
    { path: "users", children: [...UserRoutes] },
    { path: "categories", children: [...CategoryRoutes] },
    { path: "inventories", children: [...InventoryRoutes] },
    { path: "suppliers", children: [...SupplierRoutes] },
    { path: "companies", children: [...CompanyRoutes] },
  ],
};

export default MainRoutes;
