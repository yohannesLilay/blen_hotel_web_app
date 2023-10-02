import { Box } from "@mui/material";

import NavGroup from "./NavGroup";
import menuItem from "src/menu-items";

const DrawerContent = () => {
  const navGroups = menuItem.items.map((item) => {
    return <NavGroup key={item.id} item={item} />;
  });

  return <Box>{navGroups}</Box>;
};

export default DrawerContent;
