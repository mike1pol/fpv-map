import React, { useState } from "react";
import { useUser } from "reactfire";
import firebase from "firebase/app";
import { Button, Alert } from "antd";
import { ProfileView } from "../ProfileView";

const SignInForm: React.FC = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [error, setError] = useState();
  const onAuth = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch((err) => setError(err.message));
  };
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {error && <Alert message={error} type="error" />}
      <Button onClick={onAuth}>Вход</Button>
    </div>
  );
};

export const LoginView: React.FC = () => {
  const { data: user } = useUser();
  return user ? <ProfileView /> : <SignInForm />;
};
