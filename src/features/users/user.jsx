import { useDispatch, useSelector } from "react-redux";
import styles from "./users.module.css";
import { selectedUserWithId } from "./usersSlice";
import { bindActionCreators } from "@reduxjs/toolkit";
import {
  readAllMessagesOfUserAsync,
  unselectedFiles,
} from "../messages/messagesSlice";
import react from "../../assets/react.svg";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";
import { showMessages } from "../messages/appSlice";

export default function User({ user }) {
  const selectedUserId = useSelector((state) => state.users.selectedUserId);
  const dispatch = useDispatch();

  const bundles = useSelector((state) => state.messages.bundles);
  const numUnread = bundles
    .find((bundle) => bundle.id === user._id)
    .messages.reduce(
      (total, message) =>
        total + (!message.read && message.sentBy === user._id),
      0
    ); // fix this using length and filter instead of reduce
  const className =
    styles.user + " " + (selectedUserId === user._id ? styles.selected : "");

  // const bundles = useSelector(state => state.messages);

  const url = user.avatar;

  return (
    <>
      <div
        className={className}
        onClick={() => {
          dispatch(selectedUserWithId(user._id));
          dispatch(unselectedFiles());
          dispatch(showMessages());
          dispatch(readAllMessagesOfUserAsync(user._id));
        }}
      >
        {/* <img src={react}></img> */}
        {/* <div className={styles.profilePicture + " profile-pic"}>
          {url ? <img src={url} /> : <Icon path={mdiAccount} size={1.5} />}
        </div> */}

        <div
          className={`avatar  ${
            ["Online", "Typing"].includes(user.status) ? "online" : "offline"
          }`}
        >
          <div className="w-12 rounded-full">
            {url ? (
              <img src={url} />
            ) : (
              <div className="bg-neutral text-neutral-content h-full flex justify-center items-center rounded-full">
                <span className="text-xl">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.status}>{user.status}</div>
        </div>
        {numUnread !== 0 && <div className={styles.unread}>{numUnread}</div>}
      </div>
    </>
  );
}
