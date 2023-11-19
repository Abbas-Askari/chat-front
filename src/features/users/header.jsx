import React, { useRef, useState } from "react";
import styles from "./users.module.css";
import { useSelector } from "react-redux";

import Icon from "@mdi/react";

import { mdiAccount, mdiDotsVertical } from "@mdi/js";
import socket from "../../socket";
import ProfilePicture from "./profile-pic";

function logout() {
  localStorage.clear();
  socket.close();
  window.location.reload(false);
}

const Header = () => {
  const { users, loggedUserId } = useSelector((state) => state.users);
  const [menuOpened, setMenuOpened] = useState(false);
  const loggedUser = users.find((user) => user._id === loggedUserId);
  const url = loggedUser.avatar;
  return (
    <div className={styles.header}>
      <div className={styles.profilePicture + " profile-pic"}>
        {url ? <img src={url} /> : <Icon path={mdiAccount} size={1.5} />}
      </div>
      <div className={styles.name}>{loggedUser.username}</div>
      <Icon
        path={mdiDotsVertical}
        size={1}
        className={styles.dots}
        onClick={() => setMenuOpened(!menuOpened)}
      />
      <div className={styles.menu + " " + (!menuOpened ? styles.closed : "")}>
        <button onClick={logout}>Logout</button>
        <button>Settings</button>
      </div>
    </div>
  );
};

export default Header;
