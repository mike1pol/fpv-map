import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useUser } from "reactfire";

export const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { data: user } = useUser();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
