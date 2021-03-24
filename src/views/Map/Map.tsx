import React, { useEffect, useState, useCallback } from "react";
import { useFirestore } from "reactfire";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Typography } from "antd";
import { Loading } from "../../components/Loading";

const center = {
  lat: 59.939331,
  lng: 30.316053,
};

type Item = {
  id: string;
  name: string;
  description: string;
  like: number;
  pos: {
    lat: number;
    lng: number;
  };
};

export const MapView: React.FC = () => {
  const [list, setList] = useState<Item[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [map, setMap] = useState(null);
  const [info, setInfo] = useState<Item | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCLpqC1KmBrmatY-N3tCXvbnrFIvTfbR2E",
  });
  const firestore = useFirestore();
  const col = firestore.collection("items");
  useEffect(() => {
    const uns = col.where("is_active", "==", true).onSnapshot((docs) => {
      const l: any[] = [];
      docs.forEach((doc) => {
        const data = doc.data();
        l.push({
          ...data,
          id: doc.id,
          pos: { lat: data.pos.latitude, lng: data.pos.longitude },
        });
      });
      setList(l);
    });
    return () => {
      uns();
    };
  }, [col]);
  const onLoad = useCallback((mapC) => {
    const bounds = new (window as any).google.maps.LatLngBounds();
    mapC.fitBounds(bounds);
    setMap(mapC);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {info && (
        <InfoWindow position={info.pos} onCloseClick={() => setInfo(null)}>
          <div>
            <Typography.Title level={4}>{info.name}</Typography.Title>
            {info.description}
          </div>
        </InfoWindow>
      )}
      {list.map((item) => (
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
