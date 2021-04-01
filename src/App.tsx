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
import "firebase/analytics";

import { firebaseConfig } from "./firebase";

import { MapView } from "./views/Map/Map";
import { CreateView } from "./views/Create/Create";
import { LoginView } from "./views/Login/Login";
import { AppMenu } from "./components/AppMenu";
import { Loading } from "./components/Loading";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserCheck } from "./components/UserCheck";

import styles from "./app.module.css";
import { UserContextView } from "./userContext";
import { ModerRoute } from "./components/ModerRoute";
import { Dashboard } from "./views/Admin/Dashboard";

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
    <SuspenseWithPerf traceId="firebase-app" fallback={<Loading />}>
      <UserContextView>
        <Layout className={styles.layout}>
          <Layout.Header>
            <AppMenu />
          </Layout.Header>
          <Layout.Content>
            <UserCheck />
            <Switch>
              <PrivateRoute path="/" exact>
                <MapView />
              </PrivateRoute>
              <PrivateRoute path="/create" exact>
                <CreateView />
              </PrivateRoute>
              <ModerRoute path="/moder/spots" exact>
                <Dashboard />
              </ModerRoute>
              <Route path="/login" exact>
                <LoginView />
              </Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </UserContextView>
    </SuspenseWithPerf>
  );
};
