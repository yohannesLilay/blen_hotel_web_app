import { CategoryOutlined } from "@mui/icons-material";

const purchases = {
  id: "group-purchases",
  title: "Purchases",
  type: "group",
  children: [
    {
      id: "purchase",
      title: "Purchase",
      type: "item",
      url: "/purchases/orders",
      icon: CategoryOutlined,
    },
    {
      id: "receivable",
      title: "Receivable",
      type: "item",
      url: "/purchases/receivables",
      icon: CategoryOutlined,
    },
  ],
};

export default purchases;
