import React from "react";
import { Alert } from "antd";

import styles from "./style.module.css";

export const InviteAlert: React.FC = () => {
  return (
    <div className={styles.block}>
      <Alert message={"Для просмотра данных получите инвайт!"} type={"error"} />
    </div>
  );
};
