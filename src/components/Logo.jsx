import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ButtonBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import logo from "src/assets/logo.png";
import config from "src/config";
import { activeItem } from "src/store/slices/menuSlice";

const Logo = ({ sx, to }) => {
  const { defaultId } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      component={Link}
      onClick={() => dispatch(activeItem({ openItem: [defaultId] }))}
      to={!to ? config.defaultPath : to}
      sx={sx}
    >
      <img src={logo} alt="Blen Hotel" width="150" />
    </ButtonBase>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string,
};

export default Logo;
