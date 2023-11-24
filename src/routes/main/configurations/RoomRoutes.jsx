import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Rooms = Loadable(
  lazy(() => import("src/pages/configurations/room/Rooms"))
);
const CreateRoom = Loadable(
  lazy(() => import("src/pages/configurations/room/CreateRoom"))
);
const EditRoom = Loadable(
  lazy(() => import("src/pages/configurations/room/EditRoom"))
);

const RoomRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute element={<Rooms />} requiredPermission={"view_room"} />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute element={<CreateRoom />} requiredPermission={"add_room"} />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute element={<EditRoom />} requiredPermission={"change_room"} />
    ),
  },
];

export default RoomRoutes;
