import styles from "./users.module.css";
import User from "./user";
import { useSelector } from "react-redux";

export default function Users({}) {
  const { users, loggedUserId } = useSelector((state) => state.users);

  const loggedUser = users.find((user) => user.id === loggedUserId);

  return (
    <div className={styles.users + " users"}>
      <div className={styles.loggedUser}>
        Logged In as {loggedUser.username}
      </div>
      {users?.map(
        (user) =>
          loggedUser.id !== user.id && <User key={user.id} user={user} />
      )}
    </div>
  );
}
