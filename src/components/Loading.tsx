import React from "react";
import { Spin, SpinProps } from "antd";

export const Loading: React.FC<SpinProps> = (props) => (
  <div style={{ margin: "20px auto", textAlign: "center" }}>
    <Spin {...props} />
  </div>
);
