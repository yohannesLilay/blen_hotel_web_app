import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { AppBar, IconButton, Toolbar, useMediaQuery } from "@mui/material";
import { MenuOutlined, MenuOpenOutlined } from "@mui/icons-material";
import AppBarStyled from "./AppBarStyled";
import HeaderContent from "./HeaderContent";

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const iconBackColor = "grey.100";
  const iconBackColorOpen = "grey.200";

  const mainHeader = (
    <Toolbar>
      <IconButton
        disableRipple
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        color="secondary"
        sx={{
          color: "text.primary",
          bgcolor: open ? iconBackColorOpen : iconBackColor,
          ml: { xs: 0, md: -1 },
        }}
      >
        {!open ? <MenuOutlined /> : <MenuOpenOutlined />}
      </IconButton>
      <HeaderContent />
    </Toolbar>
  );

  const appBar = {
    position: "fixed",
    color: "inherit",
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      // boxShadow: theme.customShadows.z1
    },
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

export default Header;
