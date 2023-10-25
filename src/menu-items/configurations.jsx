import {
  BusinessOutlined,
  AccountTreeOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

const configurations = {
  id: "group-configurations",
  title: "Configurations",
  type: "group",
  permissions: ["view_supplier", "view_company", "view_work_flow"],
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
    {
      id: "workFlow",
      title: "Work Flow",
      type: "item",
      url: "/work-flows",
      permission: "view_work_flow",
      icon: TimelineOutlined,
    },
  ],
};

export default configurations;
