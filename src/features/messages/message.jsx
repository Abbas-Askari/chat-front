import { useSelector } from "react-redux";
import { getLoggedUser } from "../users/usersSlice";
import styles from "./messages.module.css";

export default function Message({ message, arrow }) {
  const { loggedUserId } = useSelector((state) => state.users);

  const isMy = loggedUserId === message.sentBy;

  const className =
    styles.message +
    " " +
    (isMy ? styles.isMy : "") +
    " " +
    (arrow ? styles.arrow : "");

  const status = message.received ? "✓✓" : message.sent ? "✓" : "";

  return (
    <div className={className}>
      <div className={styles.text}>{message.content}</div>
      {/* <div className={styles.date}>{message.date}</div> */}
      <span
        className={styles.status}
        style={{ color: message.read ? "blue" : "gray" }}
      >
        {status}
      </span>
      {/* {isMy && <span className={styles.time}>7:42 PM</span>} */}
    </div>
  );
}
