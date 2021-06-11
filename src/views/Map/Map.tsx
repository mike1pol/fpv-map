import React, { useContext, useEffect, useState } from "react";
import { Map, MapItem } from "../../components/Map/Map";
import { InviteCheck } from "../../components/InviteCheck/InviteCheck";
import { useFirestore } from "reactfire";
import { notification, Select } from "antd";
import firebase from "firebase";
import { UserContext } from "../../userContext";

import styles from "./styles.module.css";
import { changeFilter } from "./functions";

export type MapItemsFilter = {
  path: string;
  opStr: firebase.firestore.WhereFilterOp;
  value: any;
};

export type getMapItemsProps = {
  filters?: MapItemsFilter[];
  firestore: firebase.firestore.Firestore;
  onUpdate: (item: MapItem[]) => void;
  onError?: (error: Error) => void;
};

export function getMapItems({
  firestore,
  filters,
  onUpdate,
  onError,
}: getMapItemsProps): () => void {
  const onNext = (
    docs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) => {
    const l: MapItem[] = [];
    docs.forEach((doc) => {
      const data = doc.data();
      const item: MapItem = {
        id: doc.id,
        name: data.name,
        description: data.description,
        isActive: data.is_active,
        video: data.video ? data.video : [],
        pos: { lat: data.pos.latitude, lng: data.pos.longitude },
      };
      l.push(item);
    });
    onUpdate(l);
  };
  const onNextError = (error: firebase.firestore.FirestoreError) => {
    console.error(error);
    onError && onError(error);
  };
  if (filters && filters.length > 0) {
    let query: any = firestore.collection("items");
    for (const filter of filters) {
      if (filter.path === "is_active") {
        if (filter.value !== -999) {
          query = query.where(filter.path, filter.opStr, filter.value === 1);
        }
      } else {
        query = query.where(filter.path, filter.opStr, filter.value);
      }
    }
    return query.onSnapshot(onNext, onNextError);
  }
  return firestore.collection("items").onSnapshot(onNext, onNextError);
}

export const MapView: React.FC = () => {
  const user = useContext(UserContext);
  const [data, setData] = useState<MapItem[]>([]);
  const defaultFilter: MapItemsFilter = {
    path: "is_active",
    opStr: "==",
    value: 1,
  };
  const [filters, setFilters] = useState<MapItemsFilter[]>([defaultFilter]);
  const firestore = useFirestore();
  useEffect(() => {
    const uns = getMapItems({
      firestore,
      filters,
      onUpdate: (data) => {
        setData(data);
      },
      onError: (err) => {
        notification.open({
          type: "error",
          message: err.message,
        });
      },
    });
    return () => {
      uns();
    };
    // eslint-disable-next-line
  }, [filters]);
  const inFilters = (path: string): number => {
    return filters.findIndex((v) => v.path === path);
  };

  return (
    <InviteCheck>
      {user && (user.isAdmin || user.isModer) && (
        <div className={styles.toolbar}>
          <Select
            value={filters[inFilters("is_active")].value}
            className={styles.toolbar__select}
            onChange={(v) => {
              changeFilter({
                filters,
                onChanged: (filters: MapItemsFilter[]) => {
                  setFilters(filters);
                },
                filter: { path: "is_active", opStr: "==", value: v },
              });
            }}
          >
            <Select.Option value={-999}>Все</Select.Option>
            <Select.Option value={1}>Активные</Select.Option>
            <Select.Option value={0}>Не активные</Select.Option>
          </Select>
        </div>
      )}
      <Map data={data} user={user} />
    </InviteCheck>
  );
};
