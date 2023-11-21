import {
  ShoppingCartCheckoutOutlined,
  ChecklistRtlOutlined,
} from "@mui/icons-material";

const purchases = {
  id: "group-purchases",
  title: "Purchases",
  type: "group",
  permissions: ["view_purchase_order", "view_purchase_receivable"],
  children: [
    {
      id: "order",
      title: "Order",
      type: "item",
      url: "/purchases/orders",
      permission: "view_purchase_order",
      icon: ShoppingCartCheckoutOutlined,
    },
    {
      id: "receivable",
      title: "GRV",
      type: "item",
      url: "/purchases/receivables",
      permission: "view_purchase_receivable",
      icon: ChecklistRtlOutlined,
    },
  ],
};

export default purchases;
