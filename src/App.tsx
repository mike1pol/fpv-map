import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase/app";
import {
  FirebaseAppProvider,
  preloadAuth,
  preloadFirestore,
  SuspenseWithPerf,
  useFirebaseApp,
} from "reactfire";
import { Layout } from "antd";

import "firebase/auth";
import "firebase/firestore";

import { firebaseConfig } from "./firebase";

import { MapView } from "./views/Map/Map";
import { CreateView } from "./views/Create/Create";
import { LoginView } from "./views/Login/Login";
import { AppMenu } from "./components/AppMenu";
import { Loading } from "./components/Loading";

const preloadSDKs = (firebaseApp: firebase.app.App) => {
  return Promise.all([
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        return firestore().enablePersistence();
      },
    }),
    preloadAuth({ firebaseApp }),
  ]);
};

export const AppWrapper: React.FC = () => {
  return (
    <Router>
      <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
        <App />
      </FirebaseAppProvider>
    </Router>
  );
};

export const App: React.FC = () => {
  const firebaseApp = useFirebaseApp();
  preloadSDKs(firebaseApp).catch((err) => console.error(err));
  return (
    <SuspenseWithPerf traceId={"firebase-app"} fallback={<Loading />}>
      <Layout style={{ width: "100%", height: "100%" }}>
        <Layout.Header>
          <AppMenu />
        </Layout.Header>
        <Layout.Content>
          <Switch>
            <Route path="/" exact>
              <MapView />
            </Route>
            <Route path="/create" exact>
              <CreateView />
            </Route>
            <Route path="/login" exact>
              <LoginView />
            </Route>
          </Switch>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          FPV Map ©2021 Created by Mikhail Poluboyarinov
        </Layout.Footer>
      </Layout>
    </SuspenseWithPerf>
  );
};
