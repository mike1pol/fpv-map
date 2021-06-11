import React, { useState } from "react";
import { Input, Modal } from "antd";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { googleMapKey } from "../envs";
import { mapLibraries } from "../firebase";
import { Loading } from "./Loading";

export type City = { name: string; lat: number; lng: number };

export type SelectCityModalProps = {
  visible: boolean;
  onClose: (city?: City) => void;
};

export const SelectCityModal: React.FC<SelectCityModalProps> = ({
  visible,
  onClose,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
    libraries: mapLibraries,
  });
  const [ac, setAc] = useState<any>();
  const onLoad = (autocomplete: any) => {
    setAc(autocomplete);
  };
  const onPlaceChanged = () => {
    if (ac !== null) {
      const info = ac.getPlace();
      if (info) {
        const location = info.geometry.location;
        const city: City = {
          name: info.vicinity,
          lat: location.lat(),
          lng: location.lng(),
        };
        onClose(city);
        console.log();
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <Modal
      centered
      visible={visible}
      onOk={() => onClose()}
      onCancel={() => onClose()}
      title={"Выбор города"}
      footer={null}
    >
      {isLoaded ? (
        <Autocomplete
          options={{ types: ["(cities)"] }}
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <Input />
        </Autocomplete>
      ) : (
        <Loading />
      )}
    </Modal>
  );
};
