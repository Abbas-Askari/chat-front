import styles from "./messages.module.css";

export default function Message({ message, userLoggedIn, arrow }) {
  const className =
    styles.message +
    " " +
    (userLoggedIn.id === message.sentBy ? styles.isMy : "") +
    " " +
    (arrow ? styles.arrow : "");

  return (
    <div className={className}>
      <div className={styles.text}>{message.content}</div>
      {/* <div className={styles.date}>{message.date}</div> */}
    </div>
  );
}
