import React from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useUser } from "reactfire";
import { Menu } from "antd";

type menuLink = {
  title: string;
  url: string;
  isAuth?: boolean;
  isAnonymous?: boolean;
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
  const location = useLocation();
  const { data: user } = useUser();
  return (
    <Menu theme="dark" mode="horizontal">
      {menuLinks
        .filter((i) => {
          if (!user && i.isAuth) {
            return false;
          }
          return !(user && i.isAnonymous);
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
    </Menu>
  );
};
