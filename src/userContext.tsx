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
    if (data.uid) {
      firestore
        .collection("users")
        .doc(data.uid)
        .get()
        .then((doc) => {
          const d = doc.data();
          setUser({
            uid: data.uid,
            isAdmin: d?.moderator,
            isModer: d?.admin,
          });
        })
        .catch(() => {
          setUser({
            uid: data.uid,
            isAdmin: false,
            isModer: false,
          });
        });
    } else {
      setUser(undefined);
    }
  }, [data, firestore]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
