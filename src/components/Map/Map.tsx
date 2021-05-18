import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleMapKey } from "../../envs";
import { Button, Typography } from "antd";
import { Loading } from "../Loading";
import { useFirestore } from "reactfire";

import styles from "./style.module.css";
import { AddLink } from "../AddLink";

// Saint-P
const center = {
  lat: 59.939331,
  lng: 30.316053,
};

export type MapItem = {
  id: string;
  name: string;
  description: string;
  video?: string[];
  pos: {
    lat: number;
    lng: number;
  };
};

export type MapProps = {
  uid: string;
  data: MapItem[];
};

export const Map: React.FC<MapProps> = ({ data, uid }) => {
  const [info, setInfo] = useState<MapItem | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [addLink, setAddLink] = useState<string | undefined>();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
  });
  const firestore = useFirestore();
  const colLinks = firestore.collection("items_links");
  useEffect(() => {
    setLinks([]);
    if (info) {
      colLinks
        .where("is_active", "==", true)
        .where("item", "==", uid)
        .get()
        .then((docs) => {
          const l: string[] = [];
          docs.forEach((doc) => {
            l.push(doc.data().link);
          });
          setLinks(l);
        })
        .catch(console.error);
    }
    //eslint-disable-next-line
  }, [info]);

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
              created_by: uid,
            });
          })
      ).catch(console.error);
      setAddLink(undefined);
    },
    [addLink, uid, colLinks]
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
              <Typography.Title level={4}>{info.name}</Typography.Title>
              {info.description}
              {links && links.length > 0 && (
                <div>
                  <strong>Контент с спота:</strong>
                  {links.map((v) => (
                    <div key={v}>
                      <a href={v} target="_blank" rel="noreferrer">
                        {v}
                      </a>
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
