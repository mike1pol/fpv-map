import React, { useEffect, useState } from "react";
import { useFirestore, useUser } from "reactfire";
import { Loading } from "./Loading";
import { notification, Alert, Form, Input, Button, List } from "antd";
import styles from "./Map/style.module.css";

type Invite = {
  email: string;
  createdAt: string;
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "${label} обязательно!",
  types: {
    // eslint-disable-next-line no-template-curly-in-string
    email: "${label} не похоже на e-mail!",
  },
};

export const InviteList: React.FC = () => {
  const { data: user } = useUser();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Invite[]>([]);
  const [error, setError] = useState<string | undefined>();
  const firestore = useFirestore();
  const col = firestore.collection("invite");
  useEffect(() => {
    const uns = col.where("invite", "==", user.uid).onSnapshot(
      (docs) => {
        const l: Invite[] = [];
        docs.forEach((doc) => {
          const data = doc.data();
          l.push({
            email: doc.id,
            createdAt: new Date(data.createdAt.seconds * 1000).toLocaleString(),
          });
        });
        setData(l);
        setIsLoading(false);
      },
      (err) => {
        console.log(err);
        setError(err.message);
        setIsLoading(false);
      }
    );
    return () => {
      uns();
    };
    //eslint-disable-next-line
  }, [user.uid, setIsLoading]);
  if (isLoading && !error) {
    return <Loading />;
  }
  if (error) {
    return <Alert className={styles.alert} message={error} type={"error"} />;
  }
  const onFinish = (values: any) => {
    const data = {
      invite: user.uid,
      createdAt: new Date(),
    };
    col
      .doc(values.email.toLowerCase())
      .set(data)
      .then(() => {
        form.setFieldsValue({ email: "" });
        notification.open({
          message: "Инвайт создан, можно регистрироваться =)",
          type: "success",
        });
      })
      .catch((err) => {
        notification.open({
          message: `Ошибка отправки инвайта: ${err.message}`,
          type: "error",
        });
      });
  };
  return (
    <>
      <Form
        layout={"inline"}
        form={form}
        style={{ marginBottom: "20px" }}
        validateMessages={validateMessages}
        onFinish={onFinish}
      >
        <Form.Item
          name={"email"}
          label={"E-mail"}
          rules={[{ type: "email", required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Пригласить
          </Button>
        </Form.Item>
      </Form>
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            {item.email} - {item.createdAt}
          </List.Item>
        )}
      />
    </>
  );
};
