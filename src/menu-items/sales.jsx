import { AssignmentIndOutlined } from "@mui/icons-material";

const sales = {
  id: "group-sales",
  title: "Sales",
  type: "group",
  permissions: ["view_store_requisition"],
  children: [
    {
      id: "storeRequisition",
      title: "Store Requisition",
      type: "item",
      url: "/sales/store-requisitions",
      permission: "view_store_requisition",
      icon: AssignmentIndOutlined,
    },
  ],
};

export default sales;
