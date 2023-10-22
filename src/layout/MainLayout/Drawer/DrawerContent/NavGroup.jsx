import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Box, List, Typography } from "@mui/material";
import NavItem from "./NavItem";

const HasPermission = (permissions) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    !permissions ||
    (userInfo &&
      userInfo.permissions.some((userPermission) =>
        permissions.includes(userPermission)
      ))
  );
};

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  if (!HasPermission(item.permissions)) return null;

  const navCollapse = item.children?.map((menuItem) => {
    return <NavItem key={menuItem.id} item={menuItem} level={1} />;
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
