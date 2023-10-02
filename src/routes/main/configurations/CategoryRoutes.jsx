import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Categories = Loadable(
  lazy(() => import("src/pages/configurations/category/Categories"))
);
const CreateCategory = Loadable(
  lazy(() => import("src/pages/configurations/category/CreateCategory"))
);
const EditCategory = Loadable(
  lazy(() => import("src/pages/configurations/category/EditCategory"))
);

const CategoryRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Categories />}
        requiredPermission={"view_category"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateCategory />}
        requiredPermission={"add_category"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditCategory />}
        requiredPermission={"change_category"}
      />
    ),
  },
];

export default CategoryRoutes;
