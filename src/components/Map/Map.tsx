import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleMapKey } from "../../envs";
import { Alert, Typography } from "antd";
import { Loading } from "../Loading";
import { useFirestore } from "reactfire";

import styles from "./style.module.css";

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
  const [info, setInfo] = useState<MapItem | null>(null);
  const [data, setData] = useState<MapItem[]>([]);
  const [error, setError] = useState<string | undefined>();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
  });
  const firestore = useFirestore();
  const col = firestore.collection("items");
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
  if (data.length === 0 && !error) {
    return <Loading />;
  }
  if (error) {
    return <Alert className={styles.alert} message={error} type={"error"} />;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%", minHeight: "480px" }}
      center={center}
      zoom={10}
    >
      {info && (
        <InfoWindow position={info.pos} onCloseClick={() => setInfo(null)}>
          <div>
            <Typography.Title level={4}>{info.name}</Typography.Title>
            {info.description}
            {info.video && info.video.length > 0 && (
              <div>
                <strong>Видео:</strong>
                {info.video.map((v) => (
                  <div>
                    <a href={v} target="_blank" rel="noreferrer">
                      {v}
                    </a>
                  </div>
                ))}
              </div>
            )}
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
  ) : (
    <Loading />
  );
};
