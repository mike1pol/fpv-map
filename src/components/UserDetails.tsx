import React, { useState } from "react";
import { useAuth, useUser } from "reactfire";
import { Alert, Button } from "antd";

export const UserDetails: React.FC = () => {
  const [error, setError] = useState("");
  const auth = useAuth();
  const signOut = () => auth.signOut().then(() => setError("Sign out error"));
  const { data: user } = useUser();
  if (!user) {
    return <></>;
  }
  return (
    <div style={{ padding: "50px" }}>
      {error.length > 0 && <Alert message={error} type="error" />}
      <div>{user.displayName}</div>
      <div>
        <ul>
          {user.providerData.map((profile) => {
            if (profile) {
              return <li key={profile.providerId}>{profile.providerId}</li>;
            } else {
              return "null profile";
            }
          })}
        </ul>
      </div>
      <div>
        <Button onClick={signOut}>Выход</Button>
      </div>
    </div>
  );
};
