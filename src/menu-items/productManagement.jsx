import { CategoryOutlined, InventoryOutlined } from "@mui/icons-material";

const product = {
  id: "group-product",
  title: "Product",
  type: "group",
  children: [
    {
      id: "category",
      title: "Category",
      type: "item",
      url: "/categories",
      icon: CategoryOutlined,
    },
    {
      id: "product",
      title: "Item",
      type: "item",
      url: "/products",
      icon: InventoryOutlined,
    },
  ],
};

export default product;
