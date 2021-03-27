import React, { useContext } from "react";
import { Route, RouteProps } from "react-router-dom";
import { UserContext } from "../userContext";

export const ModerRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const user = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && (user.isModer || user.isAdmin) ? children : <div>Forbidden</div>
      }
    />
  );
};
