import React, { createContext, useEffect, useState } from "react";
import { useFirestore, useUser } from "reactfire";

export type User = {
  uid: string;
  isAdmin: boolean;
  isModer: boolean;
};

export const UserContext = createContext<User | undefined>(undefined);

export const UserContextView: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();
  const { data } = useUser();
  const firestore = useFirestore();
  useEffect(() => {
    let uns: () => void;
    if (data && data.uid) {
      uns = firestore
        .collection("users")
        .doc(data.uid)
        .onSnapshot(
          (doc) => {
            const d = doc.data();
            setUser({
              uid: data.uid,
              isAdmin: d?.admin,
              isModer: d?.moderator,
            });
          },
          (e) => {
            console.log(e.message);
            setUser({
              uid: data.uid,
              isAdmin: false,
              isModer: false,
            });
          }
        );
    } else {
      setUser(undefined);
    }
    return () => {
      uns && uns();
    };
  }, [data, firestore]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
