import React, { useState } from "react";

import styles from "./sendfiles.module.css";
import Icon from "@mdi/react";
import {
  mdiClose,
  mdiFile,
  mdiFileDocument,
  mdiFileImage,
  mdiSend,
} from "@mdi/js";
import {
  selectedFiles,
  sentMessageAsync,
  unselectedFiles,
} from "./messagesSlice";
import { useDispatch, useSelector } from "react-redux";

const SendFiles = ({ files, setFiles }) => {
  const filesOriginal = files;
  files = Array.from(files);
  const [selected, setSelected] = useState(files[0]);
  const url = URL.createObjectURL(selected);
  const dispatch = useDispatch();

  const { selectedUserId, loggedUserId } = useSelector((state) => state.users);

  function sendMessage(attachment) {
    const message = {
      sentTo: selectedUserId,
      sentBy: loggedUserId,
      // sentBy: userLoggedIn.id,
      date: new Date().toISOString(),
      recived: false,
      sent: false,
      read: false,
      content: "1",
      attachment: attachment,
    };
    dispatch(sentMessageAsync(message));
  }

  async function sendAllFiles() {
    const formData = new FormData();
    for (let file of files) formData.append("imagesToUpload", file);
    const res = await fetch("http://localhost:3000/files", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      dispatch(unselectedFiles());
      setFiles(null);
      const { files } = await res.json();
      files.forEach((file) => {
        sendMessage(file);
      });
      console.log({ files });
    }
  }

  return (
    <div className={styles.sendFiles}>
      <div
        className={styles.close}
        onClick={() => {
          setFiles(null);
          dispatch(unselectedFiles());
        }}
      >
        <Icon path={mdiClose} size={0.75} />
      </div>
      <div className={styles.top}>
        <div className="">{selected.name}</div>
      </div>
      <div className={styles.preview}>
        <img src={url} alt="" className={""} />
      </div>
      {/* <img src={url} alt="" className={styles.preview} /> */}
      <div className={styles.bottom}>
        <div className={styles.scroll}>
          {files.map((file, i) => (
            <div
              key={file.name}
              className={
                // "alsjdalkjd"
                styles.fileIcon +
                " " +
                (file === selected ? styles.selected : "")
              }
            >
              <Icon
                onClick={() => setSelected(files[i])}
                path={
                  file.type.startsWith("image") ? mdiFileImage : mdiFileDocument
                }
                size={2}
              />
            </div>
          ))}
        </div>
        <div className={styles.send} onClick={sendAllFiles}>
          <Icon path={mdiSend} color={"white"} size={1} />
        </div>
      </div>
    </div>
  );
};

export default SendFiles;
