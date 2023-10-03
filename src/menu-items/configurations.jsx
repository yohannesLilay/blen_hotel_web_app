import {
  CategoryOutlined,
  InventoryOutlined,
  BusinessOutlined,
  AccountTreeOutlined,
} from "@mui/icons-material";

const configurations = {
  id: "group-configurations",
  title: "Configurations",
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
      title: "Product",
      type: "item",
      url: "/products",
      icon: InventoryOutlined,
    },
    {
      id: "supplier",
      title: "Supplier",
      type: "item",
      url: "/suppliers",
      icon: BusinessOutlined,
    },
    {
      id: "company",
      title: "Company",
      type: "item",
      url: "/companies",
      icon: AccountTreeOutlined,
    },
  ],
};

export default configurations;
