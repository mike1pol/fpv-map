import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase/app";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
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
import { appVersion, sentryKey } from "./envs";

import styles from "./app.module.css";

import { MapView } from "./views/Map/Map";
import { CreateView } from "./views/Create/Create";
import { LoginView } from "./views/Login/Login";
import { AppMenu } from "./components/AppMenu";
import { Loading } from "./components/Loading";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserCheck } from "./components/UserCheck";
import { UserContextView } from "./userContext";
import { ModerRoute } from "./components/ModerRoute";
import { Dashboard } from "./views/Admin/Dashboard";

if (sentryKey) {
  Sentry.init({
    dsn: sentryKey,
    release: appVersion,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

const preloadSDKs = (firebaseApp: firebase.app.App) => {
  return Promise.all([
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        return firestore().enablePersistence({
          synchronizeTabs: true,
          experimentalForceOwningTab: true,
        });
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
  firebase.analytics(firebaseApp);
  preloadSDKs(firebaseApp).catch((err) => console.error(err));
  return (
    <SuspenseWithPerf traceId="firebase-app" fallback={<Loading />}>
      <UserContextView>
        <Layout className={styles.layout}>
          <Layout.Header>
            <AppMenu />
          </Layout.Header>
          <Layout.Content className={styles.content}>
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
