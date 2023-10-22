import {
  PersonOutlineOutlined,
  LockOutlined,
  WorkspacesOutlined,
} from "@mui/icons-material";

const security = {
  id: "security",
  title: "Security",
  type: "group",
  permissions: ["view_permission", "view_role", "view_user"],
  children: [
    {
      id: "permission",
      title: "Permission",
      type: "item",
      url: "/permissions",
      permission: "view_permission",
      icon: LockOutlined,
    },
    {
      id: "role",
      title: "Role",
      type: "item",
      url: "/roles",
      permission: "view_role",
      icon: WorkspacesOutlined,
    },
    {
      id: "user",
      title: "User",
      type: "item",
      url: "/users",
      permission: "view_user",
      icon: PersonOutlineOutlined,
    },
  ],
};

export default security;
