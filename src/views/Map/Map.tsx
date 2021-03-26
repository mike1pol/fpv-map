import React from "react";
import { Map } from "../../components/Map/Map";
import { InviteCheck } from "../../components/InviteCheck/InviteCheck";

export const MapView: React.FC = () => {
  return (
    <InviteCheck>
      <Map />
    </InviteCheck>
  );
};
