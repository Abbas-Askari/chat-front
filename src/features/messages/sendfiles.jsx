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
import { formatBytes } from "./message";
import { baseUrl } from "../../socket";

const SendFiles = ({ files, setFiles }) => {
  const filesOriginal = files;
  files = Array.from(files);
  const [selected, setSelected] = useState(files[0]);
  const url = URL.createObjectURL(selected);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const { selectedUserId, loggedUserId } = useSelector((state) => state.users);

  function sendMessage(attachment, writeContent = true) {
    const message = {
      sentTo: selectedUserId,
      sentBy: loggedUserId,
      // sentBy: userLoggedIn.id,
      date: new Date().toISOString(),
      recived: false,
      sent: false,
      read: false,
      content: writeContent ? content : "",
      attachment: attachment,
    };
    dispatch(sentMessageAsync(message));
  }

  async function sendAllFiles() {
    const formData = new FormData();
    for (let file of files) formData.append("imagesToUpload", file);
    const res = await fetch(`${baseUrl}files`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      dispatch(unselectedFiles());
      setFiles(null);
      const { files } = await res.json();
      files.forEach((file, i) => {
        sendMessage(file, i === files.length - 1);
      });
      console.log({ files });
    }
  }

  console.log(selected);
  const showImage =
    selected.type.startsWith("image") && !selected.type.includes("svg");

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
        {/* {true ? ( */}
        {showImage ? (
          <img src={url} alt="" className={""} />
        ) : (
          <div className={styles.noPreview}>
            <Icon path={mdiFile} size={5} />
            <div className="">
              <div className="">
                {selected.name} ({formatBytes(selected.size)})
              </div>
              <div className=""></div>
              {/* <div className=""> */}
              <i>No Preview available.</i>
              {/* </div> */}
            </div>
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Send a Message"
        value={content}
        onChange={(e) => {
          const value = e.target.value;
          setContent(value);
        }}
      />
      <div className={styles.bottom}>
        <div className={styles.scroll}>
          {files.map((file, i) => (
            <div
              key={file.name}
              className={
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
