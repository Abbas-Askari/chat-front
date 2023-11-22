import { useSelector } from "react-redux";
import { getLoggedUser } from "../users/usersSlice";
import styles from "./messages.module.css";
import { useEffect, useRef } from "react";
import Icon from "@mdi/react";
import {
  mdiArrowDownBold,
  mdiArrowDownBoldCircleOutline,
  mdiDownload,
  mdiFile,
} from "@mdi/js";

function downloadURI(uri, name, type) {
  const link = document.createElement("a");
  link.setAttribute("href", `data:${type},` + uri);
  // link.href = uri;
  link.setAttribute("download", name);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "? Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function Message({ message, arrow }) {
  const { loggedUserId } = useSelector((state) => state.users);
  const lastMessageRef = useRef();
  const isMy = loggedUserId === message.sentBy;
  const status = message.recived ? "✓✓" : message.sent ? "✓" : "";

  const className =
    styles.message +
    " " +
    (isMy ? styles.isMy : "") +
    " " +
    (arrow ? styles.arrow : "");

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "instant" });
  }, []);

  const hasAttachment = message.attachment;
  const type = hasAttachment && message.attachment.mimetype;
  const showImage =
    hasAttachment && type.startsWith("image") && !type.includes("svg");

  return (
    <div className={className} ref={lastMessageRef}>
      {hasAttachment && (
        <div className={styles.attachment}>
          {showImage ? (
            <img src={message.attachment.url} alt="" />
          ) : (
            <>
              <Icon path={mdiFile} size={2} />
              <div className={styles.mid}>
                <div className={styles.fileName}>
                  {message.attachment.originalname}
                </div>
                <div className={styles.fileSize}>
                  {formatBytes(message.attachment.size)}
                </div>
              </div>
              <Icon
                onClick={() => {
                  downloadURI(
                    message.attachment.url,
                    message.attachment.originalname,
                    message.attachment.mimetype
                  );
                }}
                path={mdiArrowDownBold}
                size={1.5}
              />
            </>
          )}
        </div>
      )}
      <div className={styles.text}>{message.content}</div>
      {/* <div className={styles.date}>{message.date}</div> */}
      {isMy && (
        <span
          className={styles.status}
          style={{ color: message.read ? "#53bdeb" : "#80aea5 " }}
        >
          {status}
        </span>
      )}
      {/* {isMy && <span className={styles.time}>7:42 PM</span>} */}
    </div>
  );
}
