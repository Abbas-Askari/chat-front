import { useDispatch, useSelector } from "react-redux";
import styles from "./messages.module.css";
import { sentMessage, sentMessageAsync } from "./messagesSlice";
import { useEffect, useState } from "react";
import {
  finishedTypingToAsync,
  startedTypingToAsync,
} from "../users/usersSlice";

export default function MessageForm() {
  const { selectedUserId, loggedUserId } = useSelector((state) => state.users);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  function submit(e) {
    e.preventDefault();
    if (content === "") return;
    const message = {
      sentTo: selectedUserId,
      sentBy: loggedUserId,
      // sentBy: userLoggedIn.id,
      date: new Date().toISOString(),
      received: false,
      sent: false,
      read: false,
      content: content,
    };

    dispatch(sentMessageAsync(message));
    dispatch(finishedTypingToAsync(selectedUserId));
    setContent("");
  }

  return (
    <form action="" onSubmit={submit}>
      <input
        type="text"
        name="message"
        placeholder="Send a Message"
        value={content}
        onChange={(e) => {
          const value = e.target.value;
          setContent(value);
          if (value !== "") {
            dispatch(startedTypingToAsync(selectedUserId));
          } else {
            dispatch(finishedTypingToAsync(selectedUserId));
          }
        }}
      />
      <button>Send</button>
    </form>
  );
}
