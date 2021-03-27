import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleMapKey } from "../../envs";
import { Alert, Button, Typography } from "antd";
import { Loading } from "../Loading";
import { useFirestore, useUser } from "reactfire";

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
  like: number;
  video?: string[];
  pos: {
    lat: number;
    lng: number;
  };
};

export const Map: React.FC = () => {
  const { data: user } = useUser();
  const [info, setInfo] = useState<MapItem | null>(null);
  const [data, setData] = useState<MapItem[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [links, setLinks] = useState<string[]>([]);
  const [addLink, setAddLink] = useState<string | undefined>();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
  });
  const firestore = useFirestore();
  const col = firestore.collection("items");
  const colLinks = firestore.collection("items_links");
  useEffect(() => {
    setLinks([]);
    if (info) {
      console.log("get data", info.id);
      colLinks
        .where("is_active", "==", true)
        .where("item", "==", info.id)
        .get()
        .then((docs) => {
          console.log("data");
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
  useEffect(() => {
    const uns = col.where("is_active", "==", true).onSnapshot(
      (docs) => {
        const l: any[] = [];
        docs.forEach((doc) => {
          const data = doc.data();
          l.push({
            ...data,
            id: doc.id,
            video: data.video ? data.video : [],
            pos: { lat: data.pos.latitude, lng: data.pos.longitude },
          });
        });
        setData(l);
      },
      (err) => {
        setError(err.message);
      }
    );
    return () => {
      uns();
    };
    //eslint-disable-next-line
  }, [undefined]);

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
              created_by: user.uid,
            });
          })
      ).catch(console.error);
      setAddLink(undefined);
    },
    [addLink, user.uid, colLinks]
  );

  if (data.length === 0 && !error) {
    return <Loading />;
  }
  if (error) {
    return <Alert className={styles.alert} message={error} type={"error"} />;
  }

  return isLoaded ? (
    <>
      {addLink && (
        <AddLink
          onSubmit={handleAddLink}
          onCancel={() => setAddLink(undefined)}
        />
      )}
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          minHeight: "480px",
        }}
        center={center}
        zoom={10}
      >
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
