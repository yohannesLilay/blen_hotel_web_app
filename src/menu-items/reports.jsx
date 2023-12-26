import { BarChartOutlined } from "@mui/icons-material";

const reports = {
  id: "group-reports",
  title: "Reports",
  type: "group",
  permissions: [
    "view_product_sales_report",
    "view_periodic_sales_report",
    "view_reorder_status_report",
    "view_sales_by_staff_report",
    "view_room_revenue_report",
  ],
  children: [
    {
      id: "report",
      title: "Report",
      type: "item",
      url: "/reports",
      permission: "view_menu",
      icon: BarChartOutlined,
    },
  ],
};

export default reports;
