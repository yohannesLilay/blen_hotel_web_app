import { GridViewOutlined } from "@mui/icons-material";

const dashboard = {
  id: "navigation",
  type: "group",
  children: [
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
      permission: "",
      icon: GridViewOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
