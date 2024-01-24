import styles from "./messages.module.css";
import Message from "./message";
import { useDispatch, useSelector } from "react-redux";
import MessageForm from "./send";
import Icon from "@mdi/react";
import { mdiAccount, mdiMenu } from "@mdi/js";
import { showUsersPane } from "./appSlice";

export default function Messages() {
  const { bundles, haveSelectedFiles } = useSelector((state) => state.messages);
  const { loggedUserId, selectedUserId, users } = useSelector(
    (state) => state.users
  );
  const { showingUsers } = useSelector((state) => state.app);
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
    <div
      className={
        styles.messages + " messages " + (showingUsers ? styles.hide : "")
      }
    >
      <div className={styles.header}>
        <div
          className={`avatar  ${
            ["Online", "Typing"].includes(selectedUser.status)
              ? "online"
              : "offline"
          }`}
        >
          <div className="w-12 rounded-full h-12 self-center">
            {url ? (
              <img src={url} />
            ) : (
              <div className="bg-neutral text-neutral-content h-full flex justify-center items-center rounded-full">
                <span className="text-xl">
                  {selectedUser.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.mid + " self-center"}>
          <div className={styles.name}>{selectedUser.username}</div>
          <div className={styles.status}>{selectedUser.status}</div>
        </div>
        <Icon
          path={mdiMenu}
          size={1.5}
          onClick={() => {
            dispatch(showUsersPane());
          }}
        />
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
