import { useDispatch, useSelector } from "react-redux";
import styles from "./users.module.css";
import { selectedUserWithId } from "./usersSlice";

export default function User({ user }) {
  const selected = useSelector((state) => state.users.selectedUserId);
  const dispatch = useDispatch();

  const className =
    styles.user + " " + (selected === user.id ? styles.selected : "");

  return (
    <>
      <div
        className={className}
        onClick={() => dispatch(selectedUserWithId(user.id))}
      >
        <div className={styles.username}>{user.username}</div>
        <div className={styles.status}>{user.status}</div>
      </div>
    </>
  );
}
