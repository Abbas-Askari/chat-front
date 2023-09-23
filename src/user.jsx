import styles from "./users.module.css";

export default function User({ user, selected, setSelected }) {
  if (!user.status) {
    user.status = "Offline";
  }

  const className =
    styles.user + " " + (selected.id === user.id ? styles.selected : "");

  return (
    <>
      <div className={className} onClick={() => setSelected(user)}>
        <div className={styles.username}>{user.username}</div>
        <div className={styles.status}>{user.status}</div>
      </div>
    </>
  );
}
