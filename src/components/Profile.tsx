import React from "react";
import { useUser } from "reactfire";

export const Profile: React.FC = () => {
  const { data: user } = useUser();
  if (!user) {
    return <></>;
  }
  return (
    <div>
      <div>
        E-mail: {user.email} {!user.emailVerified && <>Не подтвержден</>}
      </div>
      <br />
      <div>Тут пока пусто, но возможно что-то появится</div>
    </div>
  );
};
