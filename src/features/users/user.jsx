import { useDispatch, useSelector } from "react-redux";
import styles from "./users.module.css";
import { selectedUserWithId } from "./usersSlice";
import { bindActionCreators } from "@reduxjs/toolkit";
import { readAllMessagesOfUserAsync } from "../messages/messagesSlice";
import react from "../../assets/react.svg";

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
    );
  const className =
    styles.user + " " + (selectedUserId === user._id ? styles.selected : "");

  return (
    <>
      <div
        className={className}
        onClick={() => {
          dispatch(selectedUserWithId(user._id));
          console.log(user._id);
          dispatch(readAllMessagesOfUserAsync(user._id));
        }}
      >
        <img src={react}></img>
        <div className={styles.right}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.status}>{user.status}</div>
        </div>
        {numUnread !== 0 && <div className={styles.unread}>{numUnread}</div>}
      </div>
    </>
  );
}
