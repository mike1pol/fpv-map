import React, { useContext } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useAuth } from "reactfire";
import { Menu } from "antd";
import { UserContext } from "../userContext";

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
    title: "Модерка спотов",
    url: "/moder/spots",
    isModer: true,
    isAdmin: true,
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
  const location = useLocation();
  const user = useContext(UserContext);
  const auth = useAuth();
  const signOut = () =>
    auth.signOut().catch(() => console.error("Sign out error"));
  return (
    <Menu theme="dark" mode="horizontal">
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
      {user && <Menu.Item onClick={() => signOut()}>Выход</Menu.Item>}
    </Menu>
  );
};
