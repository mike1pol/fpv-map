import React, { useEffect, useState } from "react";
import { useFirestore } from "reactfire";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Typography } from "antd";
import { Loading } from "../../components/Loading";
import { googleMapKey } from "../../envs";

// Saint-P
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
  // const [map, setMap] = useState(null);
  const [info, setInfo] = useState<Item | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
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
    //eslint-disable-next-line
  }, [undefined]);
  // const onLoad = useCallback((mapC) => {
  //   console.log("onLoad", googleMapKey);
  //   const bounds = new (window as any).google.maps.LatLngBounds();
  //   mapC.fitBounds(bounds);
  //   setMap(mapC);
  // }, []);
  //
  // const onUnmount = useCallback(() => {
  //   setMap(null);
  // }, []);
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%", minHeight: "480px" }}
      center={center}
      zoom={11}
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
