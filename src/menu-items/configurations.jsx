import {
  BusinessOutlined,
  AccountTreeOutlined,
  TimelineOutlined,
  RestaurantMenuOutlined,
} from "@mui/icons-material";

const configurations = {
  id: "group-configurations",
  title: "Configurations",
  type: "group",
  permissions: [
    "view_supplier",
    "view_facility_type",
    "view_work_flow",
    "view_menu",
  ],
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
      id: "facilityType",
      title: "Facility Type",
      type: "item",
      url: "/facility-types",
      permission: "view_facility_type",
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
    {
      id: "menu",
      title: "Menu",
      type: "item",
      url: "/menus",
      permission: "view_menu",
      icon: RestaurantMenuOutlined,
    },
  ],
};

export default configurations;
