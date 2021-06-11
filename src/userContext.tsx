import React, { createContext, useEffect, useState } from "react";
import { useFirestore, useUser } from "reactfire";
import { City } from "./components/SelectCityModal";

export type User = {
  uid: string;
  isAdmin: boolean;
  isModer: boolean;
  hasProfile: boolean;
  city: City;
};

const defaultCity: City = {
  name: "Санкт-Петербург",
  lat: 59.9310584,
  lng: 30.3609097,
};

export const UserContext = createContext<User | undefined>(undefined);

export const UserContextView: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();
  const { data } = useUser();
  const firestore = useFirestore();
  useEffect(() => {
    let u: User = {
      uid: data.uid,
      isAdmin: false,
      isModer: false,
      hasProfile: false,
      city: defaultCity,
    };
    let uns: () => void;
    let uns2: () => void;
    if (data && data.uid) {
      uns = firestore
        .collection("users")
        .doc(data.uid)
        .onSnapshot(
          (doc) => {
            const d = doc.data();
            if (d) {
              u.isModer = d.moderator;
              u.isAdmin = d.admin;
            }
            setUser({ ...u });
          },
          (e) => {
            console.log(e.message);
            u.isModer = false;
            u.isAdmin = false;
            setUser({ ...u });
          }
        );
      uns2 = firestore
        .collection("profile")
        .doc(data.uid)
        .onSnapshot(
          (doc) => {
            const d = doc.data();
            if (d) {
              u.hasProfile = true;
              if (d.city) {
                u.city = d.city;
              }
            }
            setUser({ ...u });
          },
          (e) => {
            console.log(e.message);
          }
        );
    } else {
      setUser(undefined);
    }
    return () => {
      uns && uns();
      uns2 && uns2();
    };
  }, [data, firestore]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
