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
  console.log({ loggedUser });
  const url = loggedUser.avatar;
  return (
    <div className={styles.header}>
      <div className="avatar ">
        <div className="w-12 rounded-full">
          {url ? (
            <img src={url} />
          ) : (
            <div className="bg-neutral text-neutral-content rounded-full h-full flex justify-center items-center">
              <span className="text-xl">
                {loggedUser.username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mr-auto">{loggedUser.username}</div>
      <Icon
        path={mdiDotsVertical}
        size={1}
        className={styles.dots}
        onClick={() => setMenuOpened(!menuOpened)}
      />
      <div className={styles.menu + " " + (!menuOpened ? styles.closed : "")}>
        <button onClick={logout}>Logout</button>
        <button
          onClick={() => {
            document.querySelector("#settings").showModal();
          }}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Header;
