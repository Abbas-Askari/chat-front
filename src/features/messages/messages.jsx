import styles from "./messages.module.css";
import Message from "./message";
import socket from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import usersSlice, { otherUserSignedIn } from "../users/usersSlice";
import { gotMessage, startedEmptyChat } from "./messagesSlice";
import { useEffect } from "react";
import MessageForm from "./send";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";

export default function Messages() {
  const { bundles, haveSelectedFiles } = useSelector((state) => state.messages);
  const { loggedUserId, selectedUserId, users } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();
  const selectedUser = users.find((user) => user._id === selectedUserId);

  if (!selectedUser) {
    return (
      <>
        <div className={styles.unselected}>
          <i>Select a user to message!</i>
        </div>
      </>
    );
  }

  if (loggedUserId === null) {
    console.error("Why no loggedUserId?");
  }

  const selectedUserBundle = bundles.find(
    (bundle) => bundle.id === selectedUserId
  );

  let messages = selectedUserBundle ? selectedUserBundle.messages : [];

  const typing = selectedUser.status === "Typing" && (
    <div className={styles.typing + " " + styles.message + " " + styles.arrow}>
      <div className={styles.text}>
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    </div>
  );

  const url = selectedUser.avatar;

  return (
    <div className={styles.messages + " messages"}>
      <div className={styles.header}>
        <div className={styles.profilePicture + " profile-pic"}>
          {url ? <img src={url} /> : <Icon path={mdiAccount} size={1.5} />}
        </div>
        {/* <Icon path={mdiAccount} size={1.5} /> */}
        <div className={styles.right}>
          <div className={styles.name}>{selectedUser.username}</div>
          <div className={styles.status}>{selectedUser.status}</div>
        </div>
      </div>
      {!haveSelectedFiles && (
        <div className={styles.content}>
          {messages &&
            messages.map((message, i) => (
              <Message
                key={message.id || i}
                message={message}
                arrow={
                  (i !== 0 && message.sentBy !== messages[i - 1].sentBy) ||
                  i === 0
                }
              />
            ))}
          {typing}
        </div>
      )}
      <MessageForm />
    </div>
  );
}

// messages = [
//    {id: someUserId
//       messages: [{
//          id: message.id
//          sentBY: user.id,
//          sentTo: user.id,
//          recived: Boolean,
//          read: Boolean,
//          sent: Boolean,
//          date: date,
//          content: actucal t3ext content of the message
//       }]
//    }
// ]
