import React, { useState } from "react";
import { Button, Modal } from "antd";
import { InfoWindow, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { googleMapKey } from "../envs";
import { Loading } from "./Loading";

export type ModalMapProps = {
  visible: boolean;
  onClose: (lat: number, lng: number) => void;
};

const center = {
  lat: 59.939331,
  lng: 30.316053,
};

export const ModalMap: React.FC<ModalMapProps> = ({ visible, onClose }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
  });
  const [ll, setLL] = useState<{ lat: number; lng: number } | undefined>();
  return (
    <Modal
      centered
      visible={visible}
      onOk={() => ll && onClose(ll.lat, ll.lng)}
      onCancel={() => onClose(0, 0)}
      width={"100%"}
      title={"Выбор спота на карте"}
      footer={null}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            minHeight: "500px",
          }}
          center={center}
          onClick={({ latLng }) => {
            setLL({ lat: latLng.lat(), lng: latLng.lng() });
          }}
          zoom={10}
        >
          {ll && (
            <InfoWindow position={ll} onCloseClick={() => setLL(undefined)}>
              <Button onClick={() => onClose(ll.lat, ll.lng)}>Выбрать</Button>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <Loading />
      )}
    </Modal>
  );
};
