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
import LocationRoutes from "./configurations/LocationRoutes";
import SubLocationRoutes from "./configurations/SubLocationRoutes";
import ClientRoutes from "./business-contacts/ClientRoutes";
import RecordRoutes from "./transactions/RecordRoutes";
import ClientLedgerRoutes from "./transactions/ClientLedgerRoutes";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { path: "dashboard", element: <PrivateRoute element={<Dashboard />} /> },
    { path: "permissions", children: [PermissionRoutes] },
    { path: "roles", children: [...RoleRoutes] },
    { path: "users", children: [...UserRoutes] },
    { path: "locations", children: [...LocationRoutes] },
    { path: "sub-locations", children: [...SubLocationRoutes] },
    { path: "clients", children: [...ClientRoutes] },
    { path: "transaction-records", children: [...RecordRoutes] },
    { path: "client-ledgers", children: [...ClientLedgerRoutes] },
  ],
};

export default MainRoutes;
