import { BusinessOutlined, AccountTreeOutlined } from "@mui/icons-material";

const configurations = {
  id: "group-configurations",
  title: "Configurations",
  type: "group",
  permissions: ["view_supplier", "view_company"],
  children: [
    {
      id: "supplier",
      title: "Supplier",
      type: "item",
      url: "/suppliers",
      permission: "view_supplier",
      icon: BusinessOutlined,
    },
    {
      id: "company",
      title: "Company",
      type: "item",
      url: "/companies",
      permission: "view_company",
      icon: AccountTreeOutlined,
    },
  ],
};

export default configurations;
