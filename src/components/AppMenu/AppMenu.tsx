import React, { useContext, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useAuth, useFirestore } from "reactfire";
import { Menu } from "antd";
import { UserContext } from "../../userContext";

import styles from "./styles.module.css";
import { City, SelectCityModal } from "../SelectCityModal";

type menuLink = {
  title: string;
  url: string;
  isAuth?: boolean;
  isAnonymous?: boolean;
  isModer?: boolean;
  isAdmin?: boolean;
};

const menuLinks: menuLink[] = [
  {
    title: "Карта",
    url: "/",
  },
  {
    title: "Добавить спот",
    url: "/create",
    isAuth: true,
  },
  {
    title: "Вход",
    url: "/login",
    isAnonymous: true,
  },
  {
    title: "Профиль",
    url: "/login",
    isAuth: true,
  },
];

const hasMatchRoute = (path: string, link: string) => {
  const m = matchPath(path, {
    path: link,
    exact: true,
    strict: false,
  });
  return m && "path" in m;
};

export const AppMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const location = useLocation();
  const firestore = useFirestore();
  const user = useContext(UserContext);
  const auth = useAuth();
  const signOut = () =>
    auth.signOut().catch(() => console.error("Sign out error"));
  const handleOpenModal = () => setModalVisible(true);
  const collection = firestore.collection("profile");
  const handleModalClose = (city?: City) => {
    if (city && user) {
      if (user.hasProfile) {
        collection.doc(user.uid).update({ city }).catch(console.error);
      } else {
        collection.doc(user.uid).set({ city }).catch(console.error);
      }
    }
    setModalVisible(false);
  };
  return (
    <div className={styles.menu}>
      <SelectCityModal visible={modalVisible} onClose={handleModalClose} />
      <Menu className={styles.menu_first} theme="dark" mode="horizontal">
        {menuLinks
          .filter((i) => {
            if (!user && i.isAuth) {
              return false;
            }
            return !(user && i.isAnonymous);
          })
          .filter((i) => {
            if (!i.isAdmin && !i.isModer) {
              return true;
            } else if (user && i.isAdmin && user.isAdmin) {
              return true;
            } else if (user && i.isModer && user.isModer) {
              return true;
            }
            return false;
          })
          .map((i) => (
            <Menu.Item
              className={
                hasMatchRoute(location.pathname, i.url)
                  ? "ant-menu-item-selected"
                  : ""
              }
              key={i.url}
            >
              <Link to={i.url}>{i.title}</Link>
            </Menu.Item>
          ))}
        {user && (
          <Menu.Item className={styles.menu_items} onClick={handleOpenModal}>
            {user.city.name}
          </Menu.Item>
        )}
        {user && (
          <Menu.Item className={styles.menu_items} onClick={signOut}>
            Выход
          </Menu.Item>
        )}
      </Menu>
      {user && (
        <Menu
          className={styles.menu_second}
          selectable={false}
          theme="dark"
          mode="horizontal"
        >
          <Menu.Item onClick={handleOpenModal}>{user.city.name}</Menu.Item>
          <Menu.Item onClick={signOut}>Выход</Menu.Item>
        </Menu>
      )}
    </div>
  );
};
