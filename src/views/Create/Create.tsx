import React, { useContext } from "react";
import { Typography, notification, Form } from "antd";
import { useFirestore } from "reactfire";
import firebase from "firebase/app";

import { CreateForm, FormValues } from "../../components/CreateForm";
import { InviteCheck } from "../../components/InviteCheck/InviteCheck";
import { UserContext } from "../../userContext";

export const CreateView: React.FC = () => {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const firestore = useFirestore();
  const col = firestore.collection("items");
  const colLinks = firestore.collection("items_links");
  const onSubmit = (values: FormValues) => {
    if (!user) {
      notification.open({
        message: "Ошибка отправки, обновите страницу",
        type: "error",
      });
      return;
    }
    const pos = new firebase.firestore.GeoPoint(values.lat, values.lng);
    const isActive =
      user && (user.isModer || user.isAdmin) ? values.is_active : false;
    col
      .add({
        name: values.name,
        description: values.description,
        pos,
        is_active: isActive,
        created_by: user.uid,
        like: 0,
      })
      .then<Promise<any>>((doc) => {
        if (values.links && values.links.length > 0) {
          return Promise.all(
            values.links
              .filter((v) => v && v.length > 0)
              .map((v) => {
                return colLinks.add({
                  link: v,
                  item: doc.id,
                  is_active: isActive,
                  created_by: user.uid,
                });
              })
          );
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        form.resetFields();
        notification.open({
          message:
            "Спот отправлен на модерацию в ближайшее время он появится на карте.",
          type: "success",
        });
      })
      .catch((err) => {
        notification.open({
          message: err.message,
          type: "error",
        });
      });
  };
  return (
    <InviteCheck>
      <div style={{ padding: "50px" }}>
        <Typography.Title level={3}>Добавить спот</Typography.Title>
        <CreateForm form={form} onSubmit={onSubmit} />
      </div>
    </InviteCheck>
  );
};
