import React, { useEffect, useState } from "react";
import { useFirestore, useUser } from "reactfire";
import { Alert } from "antd";

import styles from "./styles.module.css";

export const InviteCheck: React.FC = ({ children }) => {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const [err, setErr] = useState<string | undefined>();
  const doc = firestore.doc(`invite/${user.email}`);
  useEffect(() => {
    const uns = doc.onSnapshot(
      () => {
        setErr(undefined);
      },
      (error) => {
        setErr(error.code);
      }
    );
    return () => {
      uns();
    };
    //eslint-disable-next-line
  }, []);

  return err ? (
    <Alert
      className={styles.alert}
      message={"Для доступа необходим инвайт!"}
      type={"error"}
    />
  ) : (
    <>{children}</>
  );
};
