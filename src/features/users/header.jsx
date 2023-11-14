import React from "react";
import styles from "./users.module.css";
import { useSelector } from "react-redux";

import Icon from "@mdi/react";

import { mdiAccount, mdiDotsVertical } from "@mdi/js";

const Header = () => {
  const { users, loggedUserId } = useSelector((state) => state.users);

  const loggedUser = users.find((user) => user.id === loggedUserId);

  return (
    <div className={styles.header}>
      <Icon path={mdiAccount} size={1.5} />
      <div className={styles.name}>{loggedUser.username}</div>
      <Icon path={mdiDotsVertical} size={1} />
    </div>
  );
};

export default Header;
