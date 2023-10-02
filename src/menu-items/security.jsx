import {
  PersonOutlineOutlined,
  LockOutlined,
  WorkspacesOutlined,
} from "@mui/icons-material";

const security = {
  id: "security",
  title: "Security",
  type: "group",
  children: [
    {
      id: "permission",
      title: "Permission",
      type: "item",
      url: "/permissions",
      icon: LockOutlined,
    },
    {
      id: "role",
      title: "Role",
      type: "item",
      url: "/roles",
      icon: WorkspacesOutlined,
    },
    {
      id: "user",
      title: "User",
      type: "item",
      url: "/users",
      icon: PersonOutlineOutlined,
    },
  ],
};

export default security;
