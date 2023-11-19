import { useDispatch, useSelector } from "react-redux";
import styles from "./messages.module.css";
import { selectedFiles, sentMessage, sentMessageAsync } from "./messagesSlice";
import { useEffect, useState } from "react";
import {
  finishedTypingToAsync,
  startedTypingToAsync,
} from "../users/usersSlice";
import Icon from "@mdi/react";
import {
  mdiPaperclip,
  mdiPaperclipCheck,
  mdiPaperclipLock,
  mdiPaperclipMinus,
  mdiPaperclipOff,
  mdiPaperclipRemove,
  mdiSend,
} from "@mdi/js";
import SendFiles from "./sendfiles";

export default function MessageForm() {
  const { selectedUserId, loggedUserId } = useSelector((state) => state.users);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState();
  const dispatch = useDispatch();

  function submit(e) {
    e.preventDefault();
    if (content === "") return;
    const message = {
      sentTo: selectedUserId,
      sentBy: loggedUserId,
      // sentBy: userLoggedIn.id,
      date: new Date().toISOString(),
      recived: false,
      sent: false,
      read: false,
      content: content,
    };

    dispatch(sentMessageAsync(message));
    dispatch(finishedTypingToAsync(selectedUserId));
    setContent("");
  }

  if (files) {
    console.log("will render files");
    return <SendFiles files={files} setFiles={setFiles} />;
  } else {
    console.log("Won't render files");
  }

  return (
    <form action="" onSubmit={submit} className={styles.messageform}>
      <label className={content === "" ? styles.gray : ""}>
        <Icon path={mdiPaperclip} size={1} />
        <input
          multiple
          type="file"
          name="file"
          onChange={(e) => {
            console.log({ files: e.target.files });
            setFiles(e.target.files);
            dispatch(selectedFiles());
          }}
        />
      </label>
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
      <button className={content === "" ? styles.gray : ""}>
        <Icon path={mdiSend} size={1} />
      </button>
      {/* <button>Send</button> */}
    </form>
  );
}
