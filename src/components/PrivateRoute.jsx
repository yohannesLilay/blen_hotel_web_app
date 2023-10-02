import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ element: Element, requiredPermission }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) return <Navigate to="/login" replace />;
  if (!requiredPermission || userInfo.permissions.includes(requiredPermission))
    return Element;

  return <Navigate to="/" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.object.isRequired,
  requiredPermission: PropTypes.string,
};

PrivateRoute.defaultProps = {
  requiredPermission: "",
};

export default PrivateRoute;
