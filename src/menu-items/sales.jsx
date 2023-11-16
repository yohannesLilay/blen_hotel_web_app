import {
  AssignmentIndOutlined,
  RoomServiceOutlined,
} from "@mui/icons-material";

const sales = {
  id: "group-sales",
  title: "Sales",
  type: "group",
  permissions: ["view_store_requisition", "view_captain_order"],
  children: [
    {
      id: "storeRequisition",
      title: "Store Requisition",
      type: "item",
      url: "/sales/store-requisitions",
      permission: "view_store_requisition",
      icon: AssignmentIndOutlined,
    },
    {
      id: "captainOrder",
      title: "Captain Order",
      type: "item",
      url: "/sales/captain-orders",
      permission: "view_captain_order",
      icon: RoomServiceOutlined,
    },
  ],
};

export default sales;
