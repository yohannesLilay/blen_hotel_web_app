import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const FacilityTypes = Loadable(
  lazy(() => import("src/pages/configurations/facility-type/FacilityTypes"))
);
const CreateFacilityType = Loadable(
  lazy(() =>
    import("src/pages/configurations/facility-type/CreateFacilityType")
  )
);
const EditFacilityType = Loadable(
  lazy(() => import("src/pages/configurations/facility-type/EditFacilityType"))
);

const FacilityTypeRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<FacilityTypes />}
        requiredPermission={"view_facility_type"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateFacilityType />}
        requiredPermission={"add_facility_type"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditFacilityType />}
        requiredPermission={"change_facility_type"}
      />
    ),
  },
];

export default FacilityTypeRoutes;
