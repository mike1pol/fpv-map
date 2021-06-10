import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleMapKey } from "../../envs";
import { Button, Typography } from "antd";
import { CheckOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Loading } from "../Loading";
import { useFirestore } from "reactfire";

import styles from "./style.module.css";
import { AddLink } from "../AddLink";
import firebase from "firebase";
import { User } from "../../userContext";

// Saint-P
const center = {
  lat: 59.939331,
  lng: 30.316053,
};

export type MapItem = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  video?: string[];
  pos: {
    lat: number;
    lng: number;
  };
};

export type MapProps = {
  user: User | undefined;
  data: MapItem[];
};

type Link = {
  uid: string;
  link: string;
  isActive: boolean;
};

function mapLinks(
  docs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
): Link[] {
  const l: Link[] = [];
  docs.forEach((doc) => {
    const data = doc.data();
    l.push({
      uid: doc.id,
      link: data.link,
      isActive: data.is_active,
    });
  });
  return l;
}

type getLinksByItemProps = {
  col: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  item: string;
  active?: boolean;
  onNext: (link: Link[]) => void;
};

function getLinksByItem({ col, item, active, onNext }: getLinksByItemProps) {
  if (active === true || active === false) {
    return col
      .where("is_active", "==", active)
      .where("item", "==", item)
      .onSnapshot((next) => onNext(mapLinks(next)));
  }

  return col
    .where("item", "==", item)
    .onSnapshot((next) => onNext(mapLinks(next)));
}

const LinkAdminBar: React.FC<{ link: Link; user: User | undefined }> = ({
  link,
  user,
}) => {
  const firestore = useFirestore();
  const handleUpdate = useCallback(async () => {
    firestore
      .doc(`items_links/${link.uid}`)
      .update("is_active", !link.isActive)
      .catch(console.error);
  }, [firestore, link]);

  if (user && (user.isAdmin || user.isModer)) {
    return (
      <Button
        style={{ marginLeft: "10px" }}
        size={"small"}
        type={"primary"}
        icon={!link.isActive ? <CheckOutlined /> : <CloseCircleOutlined />}
        danger={link.isActive}
        onClick={handleUpdate}
      />
    );
  }
  return null;
};

const InfoAdminBar: React.FC<{ info: MapItem; user: User | undefined }> = ({
  info,
  user,
}) => {
  const firestore = useFirestore();
  const handleUpdate = useCallback(async () => {
    firestore
      .doc(`items/${info.id}`)
      .update("is_active", !info.isActive)
      .catch(console.error);
  }, [firestore, info]);
  if (user && (user.isAdmin || user.isModer)) {
    return (
      <>
        <Button
          style={{ marginLeft: "10px" }}
          size={"small"}
          type={"primary"}
          icon={!info.isActive ? <CheckOutlined /> : <CloseCircleOutlined />}
          danger={info.isActive}
          onClick={handleUpdate}
        />
      </>
    );
  }
  return null;
};

export const Map: React.FC<MapProps> = ({ data, user }) => {
  const [info, setInfo] = useState<MapItem | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [addLink, setAddLink] = useState<string | undefined>();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
  });
  const firestore = useFirestore();
  const colLinks = firestore.collection("items_links");
  useEffect(() => {
    if (info && data.length) {
      const el = data.find((v) => v.id === info.id);
      if (!el) {
        setInfo(null);
      } else {
        setInfo(el);
      }
    }
  }, [data, info]);

  useEffect(() => {
    setLinks([]);
    if (info) {
      getLinksByItem({
        col: colLinks,
        item: info.id,
        active: user && (user.isAdmin || user.isModer) ? undefined : true,
        onNext: (l) => setLinks(l),
      });
    }
    //eslint-disable-next-line
  }, [info, user]);

  const handleAddLink = useCallback(
    (links: string[]) => {
      Promise.all(
        links
          .filter((v) => v && v.length > 0)
          .map((v) => {
            return colLinks.add({
              link: v,
              item: addLink,
              is_active: false,
              created_by: user && user.uid,
            });
          })
      ).catch(console.error);
      setAddLink(undefined);
    },
    [addLink, user, colLinks]
  );

  return isLoaded ? (
    <>
      {addLink && (
        <AddLink
          onSubmit={handleAddLink}
          onCancel={() => setAddLink(undefined)}
        />
      )}
      <GoogleMap mapContainerClassName={styles.map} center={center} zoom={10}>
        {info && (
          <InfoWindow position={info.pos} onCloseClick={() => setInfo(null)}>
            <div>
              <Typography.Title level={4}>
                {info.name}
                <InfoAdminBar info={info} user={user} />
              </Typography.Title>
              {info.description}
              {links && links.length > 0 && (
                <div>
                  <strong>Контент с спота:</strong>
                  {links.map((v) => (
                    <div key={v.uid}>
                      <a href={v.link} target="_blank" rel="noreferrer">
                        {v.link}
                      </a>
                      <LinkAdminBar link={v} user={user} />
                    </div>
                  ))}
                </div>
              )}
              <hr />
              <Button size={"small"} onClick={() => setAddLink(info.id)}>
                Добавить видео/фото
              </Button>
            </div>
          </InfoWindow>
        )}
        {data.map((item) => (
          <Marker
            key={item.id}
            position={item.pos}
            onClick={() => setInfo(item)}
          />
        ))}
      </GoogleMap>
    </>
  ) : (
    <Loading />
  );
};
