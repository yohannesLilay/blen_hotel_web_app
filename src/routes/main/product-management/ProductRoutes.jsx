import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const Products = Loadable(
  lazy(() => import("src/pages/product-management/product/Products"))
);
const CreateProduct = Loadable(
  lazy(() => import("src/pages/product-management/product/CreateProduct"))
);
const EditProduct = Loadable(
  lazy(() => import("src/pages/product-management/product/EditProduct"))
);

const ProductRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<Products />}
        requiredPermission={"view_product"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateProduct />}
        requiredPermission={"add_product"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditProduct />}
        requiredPermission={"change_product"}
      />
    ),
  },
];

export default ProductRoutes;
