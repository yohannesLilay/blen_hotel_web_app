import { lazy } from "react";
import Loadable from "src/components/Loadable";

/** Private Routes */
import PrivateRoute from "src/components/PrivateRoute";

const WorkFlows = Loadable(
  lazy(() => import("src/pages/configurations/work-flow/WorkFlows"))
);
const CreateWorkFlow = Loadable(
  lazy(() => import("src/pages/configurations/work-flow/CreateWorkFlow"))
);
const EditWorkFlow = Loadable(
  lazy(() => import("src/pages/configurations/work-flow/EditWorkFlow"))
);

const WorkFlowRoutes = [
  {
    path: "",
    element: (
      <PrivateRoute
        element={<WorkFlows />}
        requiredPermission={"view_work_flow"}
      />
    ),
  },
  {
    path: "create",
    element: (
      <PrivateRoute
        element={<CreateWorkFlow />}
        requiredPermission={"add_work_flow"}
      />
    ),
  },
  {
    path: ":id/edit",
    element: (
      <PrivateRoute
        element={<EditWorkFlow />}
        requiredPermission={"change_work_flow"}
      />
    ),
  },
];

export default WorkFlowRoutes;
