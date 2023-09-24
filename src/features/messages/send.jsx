import { useDispatch, useSelector } from "react-redux";
import styles from "./messages.module.css";
import { sentMessage, sentMessageAsync } from "./messagesSlice";

export default function MessageForm() {
  const { selectedUserId, loggedUserId } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  function submit(e) {
    e.preventDefault();
    const message = {
      sentTo: selectedUserId,
      sentBy: loggedUserId,
      // sentBy: userLoggedIn.id,
      date: new Date().toISOString(),
      received: false,
      sent: false,
      read: false,
      content: e.target.message.value,
    };

    dispatch(sentMessageAsync(message));
    e.target.message.value = "";
  }

  return (
    <form action="" onSubmit={submit}>
      <input type="text" name="message" placeholder="Send a Message" />
      <button>Send</button>
    </form>
  );
}
