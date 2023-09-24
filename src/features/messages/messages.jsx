import styles from "./messages.module.css";
import Message from "./message";
import socket from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import usersSlice, { otherUserSignedIn } from "../users/usersSlice";
import { gotMessage, startedEmptyChat } from "./messagesSlice";
import { useEffect } from "react";
import MessageForm from "./send";

export default function Messages() {
  const { bundles } = useSelector((state) => state.messages);
  const { loggedUserId, selectedUserId, users } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();
  const selectedUser = users.find((user) => user.id === selectedUserId);
  const loggedUser = users.find((user) => user.id === loggedUserId);

  if (loggedUserId === null) {
    console.error("Why no loggedUserId?");
  }

  // console.log({ bundles, selectedUserId });
  const selectedUserBundle = bundles.find(
    (bundle) => bundle.id === selectedUser.id
  );
  let messages = selectedUserBundle ? selectedUserBundle.messages : [];
  useEffect(() => {
    // console.log({ bundles, selectedUserId });
    if (!selectedUserBundle && selectedUserId !== null) {
      dispatch(startedEmptyChat({ userId: selectedUserId }));
    }
  }, [selectedUserBundle, selectedUserId]);

  if (!selectedUser) {
    return (
      <>
        <div>
          <i>Select a user to message!</i>
        </div>
      </>
    );
  }

  //   setMessages((messages) => {
  //     const bundle = messages.find((bundle) => bundle.id === message.sentTo);
  //     if (bundle) {
  //       return messages.map((b) =>
  //         b === bundle
  //           ? { id: message.sentTo, messages: [...bundle.messages, message] }
  //           : b
  //       );
  //     } else {
  //       return [...messages, { id: message.sentTo, messages: [message] }];
  //     }
  //   });
  //   socket.emit("send_message", message);
  //   e.target.message.value = "";
  // }

  return (
    <div className={styles.messages + " messages"}>
      <div className={styles.header}>
        <div className={styles.name}>{selectedUser.username}</div>
        <div className={styles.status}>{selectedUser.status}</div>
      </div>
      <div className={styles.content}>
        <div
          className={styles.typing + " " + styles.message + " " + styles.arrow}
        >
          <div className={styles.text}>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        </div>
        {messages &&
          messages.map((message, i) => (
            <Message
              key={message.id}
              message={message}
              arrow={
                (i !== 0 && message.sentBy !== messages[i - 1].sentBy) ||
                i === 0
              }
            />
          ))}
      </div>
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
