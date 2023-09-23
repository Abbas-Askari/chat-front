import styles from "./users.module.css";
import User from "./user";

export default function Users({ users, selected, setSelected, loggedUser }) {
  return (
    <div className={styles.users + " users"}>
      <div className={styles.loggedUser}>
        Logged In as {loggedUser.username}
      </div>
      {users?.map(
        (user) =>
          loggedUser.id !== user.id && (
            <User
              key={user.id}
              user={user}
              selected={selected}
              setSelected={setSelected}
            />
          )
      )}
    </div>
  );
}
