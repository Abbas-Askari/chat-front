import styles from "./users.module.css";
import User from "./user";
import { useSelector } from "react-redux";
import Header from "./header";
import Search from "./search";

export default function Users({}) {
  const { users, loggedUserId, query } = useSelector((state) => state.users);

  const loggedUser = users.find((user) => user._id === loggedUserId);

  let filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <div className={styles.users + " users"}>
      <Header />
      <Search />
      <div className={styles.userslist}>
        {/* {users?.map(
          (user) =>
            loggedUser.id !== user.id && <User key={user.id} user={user} />
        )} */}

        {filteredUsers?.map(
          (user) =>
            loggedUser.id !== user._id && <User key={user._id} user={user} />
        )}
      </div>
    </div>
  );
}
