import React from "react";

import { Tabs } from "antd";
import { Profile } from "../components/Profile";
import { InviteList } from "../components/InviteList";
import { InviteCheck } from "../components/InviteCheck/InviteCheck";

export const ProfileView: React.FC = () => {
  return (
    <div style={{ padding: "20px 50px" }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Профиль" key="1">
          <Profile />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Инвайты" key="2">
          <InviteCheck>
            <InviteList />
          </InviteCheck>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
