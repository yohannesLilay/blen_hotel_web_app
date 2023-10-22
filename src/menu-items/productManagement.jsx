import { CategoryOutlined, InventoryOutlined } from "@mui/icons-material";

const product = {
  id: "group-product",
  title: "Product",
  type: "group",
  permissions: ["view_category", "view_product"],
  children: [
    {
      id: "category",
      title: "Category",
      type: "item",
      url: "/categories",
      permission: "view_category",
      icon: CategoryOutlined,
    },
    {
      id: "product",
      title: "Item",
      type: "item",
      url: "/products",
      permission: "view_product",
      icon: InventoryOutlined,
    },
  ],
};

export default product;
