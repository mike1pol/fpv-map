import React from "react";
import { useUser } from "reactfire";
import { Alert } from "antd";

export const UserCheck: React.FC = () => {
  const { data: user } = useUser();
  if (!user) {
    return null;
  }
  if (user && !user.emailVerified) {
    return <Alert message={"Необходимо подтвердить почту"} type={"warning"} />;
  }
  return null;
};
