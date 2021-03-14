import React from 'react';
import { Layout, Menu } from 'antd';

function App() {
  return (
    <Layout>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Map</Menu.Item>
          <Menu.Item key="2">Create Spot</Menu.Item>
          <Menu.Item key="4">Login</Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content>

      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        FPV Map ©2021 Created by Mikhail Poluboyarinov
      </Layout.Footer>
    </Layout>
  );
}

export default App;
