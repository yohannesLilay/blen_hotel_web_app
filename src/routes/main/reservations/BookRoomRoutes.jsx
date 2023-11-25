import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const BookRooms = Loadable(
  lazy(() => import("src/pages/reservations/book-room/BookRooms"))
);
const CreateBookRoom = Loadable(
  lazy(() => import("src/pages/reservations/book-room/CreateBookRoom"))
);
const EditBookRoom = Loadable(
  lazy(() => import("src/pages/reservations/book-room/EditBookRoom"))
);

const BookRoomRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<BookRooms />}
        requiredPermission={"view_book_room"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateBookRoom />}
        requiredPermission={"add_book_room"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditBookRoom />}
        requiredPermission={"change_book_room"}
      />
    ),
  },
];

export default BookRoomRoutes;
