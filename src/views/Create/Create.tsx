import React, { useState } from "react";
import { Alert, Typography } from "antd";
import { useFirestore } from "reactfire";
import firebase from "firebase/app";

import { CreateForm, FormValues } from "../../components/CreateForm";

export const CreateView: React.FC = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const firestore = useFirestore();
  const col = firestore.collection("items");
  const onSubmit = (values: FormValues) => {
    setError(undefined);
    setSuccess(false);
    const pos = new firebase.firestore.GeoPoint(values.lat, values.lng);
    col
      .add({
        name: values.name,
        description: values.description,
        pos,
        is_active: false,
        like: 0,
      })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };
  return (
    <div style={{ padding: "50px" }}>
      <Typography.Title level={3}>Добавить спот</Typography.Title>
      {error && <Alert message={error} type="error" />}
      {success ? (
        <Alert
          message={
            "Спот отправлен на модерацию в ближайшее время он появится на карте"
          }
          type="success"
        />
      ) : (
        <CreateForm onSubmit={onSubmit} />
      )}
    </div>
  );
};
