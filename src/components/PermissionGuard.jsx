import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PermissionGuard = ({ permission, children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!permission || (userInfo && userInfo.permissions.includes(permission))) {
    return children;
  } else {
    return null;
  }
};

PermissionGuard.propTypes = {
  permission: PropTypes.string,
  children: PropTypes.node,
};

PermissionGuard.defaultProps = {
  permission: "",
};

export default PermissionGuard;
