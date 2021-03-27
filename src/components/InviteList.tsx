import React, { useEffect, useState } from "react";
import { useFirestore, useUser } from "reactfire";
import { Loading } from "./Loading";
import { Alert, Form, Input, Button, List } from "antd";
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
  const [data, setData] = useState<Invite[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [inv, setInv] = useState<undefined | string>();
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
      },
      (err) => {
        console.log(err);
        setError(err.message);
      }
    );
    return () => {
      uns();
    };
    //eslint-disable-next-line
  }, [user.uid]);
  if (data.length === 0 && !error) {
    return <Loading />;
  }
  if (error) {
    return <Alert className={styles.alert} message={error} type={"error"} />;
  }
  const onFinish = (values: any) => {
    setInv(undefined);
    const data = {
      invite: user.uid,
      createdAt: new Date(),
    };
    col
      .doc(values.email.toLowerCase())
      .set(data)
      .then(() => {
        setInv("Инвайт создан, можно регистрироваться =)");
      })
      .catch((err) => {
        setInv(`Ошибка отправки инвайта: ${err.message}`);
      });
  };
  return (
    <>
      {inv && (
        <Alert
          style={{ marginBottom: "20px", maxWidth: "400px" }}
          message={inv}
          type={"info"}
          closable
          afterClose={() => setInv(undefined)}
        />
      )}
      <Form
        layout={"inline"}
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
