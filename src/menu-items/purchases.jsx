import {
  ShoppingCartCheckoutOutlined,
  ReceiptLongOutlined,
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
      title: "Receivable",
      type: "item",
      url: "/purchases/receivables",
      permission: "view_purchase_receivable",
      icon: ReceiptLongOutlined,
    },
  ],
};

export default purchases;
