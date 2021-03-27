import React, { useState } from "react";
import { Alert, Button, Typography } from "antd";
import { useFirestore, useUser } from "reactfire";
import firebase from "firebase/app";

import { CreateForm, FormValues } from "../../components/CreateForm";
import { InviteCheck } from "../../components/InviteCheck/InviteCheck";

export const CreateView: React.FC = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const { data: user } = useUser();
  const firestore = useFirestore();
  const col = firestore.collection("items");
  const colLinks = firestore.collection("items_links");
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
        created_by: user.uid,
        like: 0,
      })
      .then<Promise<any>>((doc) => {
        if (values.video && values.video.length > 0) {
          return Promise.all(
            values.video
              .filter((v) => v && v.length > 0)
              .map((v) => {
                return colLinks.add({
                  link: v,
                  item: doc.id,
                  is_active: false,
                  created_by: user.uid,
                });
              })
          );
        } else {
          return Promise.resolve();
        }
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
    <InviteCheck>
      <div style={{ padding: "50px" }}>
        <Typography.Title level={3}>Добавить спот</Typography.Title>
        {error && <Alert message={error} type="error" />}
        {success ? (
          <>
            <Alert
              message={
                "Спот отправлен на модерацию в ближайшее время он появится на карте"
              }
              type="success"
            />
            <Button onClick={() => setSuccess(false)} type={"primary"}>
              Добавить еще
            </Button>
          </>
        ) : (
          <CreateForm onSubmit={onSubmit} />
        )}
      </div>
    </InviteCheck>
  );
};
