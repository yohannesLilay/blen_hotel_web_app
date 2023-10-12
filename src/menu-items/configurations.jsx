import { BusinessOutlined, AccountTreeOutlined } from "@mui/icons-material";

const configurations = {
  id: "group-configurations",
  title: "Configurations",
  type: "group",
  children: [
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
