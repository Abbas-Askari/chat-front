import styles from "./messages.module.css";
import Message from "./message";

export default function Messages({
  messages,
  userOther,
  userLoggedIn,
  socket,
  setMessages,
}) {
  if (!userOther) {
    return (
      <>
        <div>
          <i>Select a user to message!</i>
        </div>
      </>
    );
  }

  function submit(e) {
    e.preventDefault();
    const message = {
      sentTo: userOther.id,
      sentBy: userLoggedIn.id,
      date: new Date(),
      received: false,
      sent: false,
      read: false,
      content: e.target.message.value,
    };
    setMessages((messages) => {
      const bundle = messages.find((bundle) => bundle.id === message.sentTo);
      if (bundle) {
        return messages.map((b) =>
          b === bundle
            ? { id: message.sentTo, messages: [...bundle.messages, message] }
            : b
        );
      } else {
        return [...messages, { id: message.sentTo, messages: [message] }];
      }
    });
    socket.emit("send_message", message);
    e.target.message.value = "";
  }

  if (!userOther.status) userOther.status = "Offline";
  messages = messages.find((bundle) => bundle.id === userOther.id)?.messages;
  return (
    <div className={styles.messages + " messages"}>
      <div className={styles.header}>
        <div className={styles.name}>{userOther.username}</div>
        <div className={styles.status}>{userOther.status}</div>
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
              userLoggedIn={userLoggedIn}
              arrow={
                (i !== 0 && message.sentBy !== messages[i - 1].sentBy) ||
                i === 0
              }
            />
          ))}
      </div>
      <form action="" onSubmit={submit}>
        <input type="text" name="message" placeholder="Send a Message" />
        <button>Send</button>
      </form>
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
