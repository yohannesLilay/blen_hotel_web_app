import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Profile = Loadable(lazy(() => import("src/pages/settings/Profile")));
const ChangePassword = Loadable(
  lazy(() => import("src/pages/settings/ChangePassword"))
);

const SettingRoutes = [
  {
    path: "profile",
    element: <PrivateRoute element={<Profile />} />,
  },
  {
    path: "change-password",
    element: <PrivateRoute element={<ChangePassword />} />,
  },
];

export default SettingRoutes;
