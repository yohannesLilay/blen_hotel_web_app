import {
  LocationOnOutlined,
  LocalGasStationOutlined,
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
      icon: LocationOnOutlined,
    },
    {
      id: "inventory",
      title: "Inventory",
      type: "item",
      url: "/inventories",
      icon: LocalGasStationOutlined,
    },
    {
      id: "supplier",
      title: "Supplier",
      type: "item",
      url: "/suppliers",
      icon: LocalGasStationOutlined,
    },
  ],
};

export default configurations;
