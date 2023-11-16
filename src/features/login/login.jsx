import { useDispatch, useSelector } from "react-redux";
import socket from "../../socket";
import { initServerListenersAsync } from "../messages/appSlice";
import styles from "./login.module.css";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { clearedErrors, recivedError } from "./connectionSlice";

export default function Login({}) {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const { connectionError, connected } = useSelector(
    (state) => state.connection
  );
  console.log({ connectionError, connected });

  async function submit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (!isSignUp) {
      socket.auth = { username, password };
      dispatch(initServerListenersAsync());
      socket.connect();
    } else {
      // console.log("Not yet implementd!");
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log({ data });
      if (res.ok) {
        dispatch(clearedErrors());
        setIsSignUp(false);
      } else {
        dispatch(recivedError({ error: data.error }));
      }
    }
  }

  function change() {
    setIsSignUp(!isSignUp);
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} action="" onSubmit={submit}>
        <div className={styles.header}>{isSignUp ? "Sign Up" : "Sign In"}</div>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="User Name"
            id="username"
          />
          <span className={styles.error}>{connectionError}</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            id="password"
          />
          {/* <span className={styles.error}>Incorrect Username</span> */}
        </div>
        <div className={styles.formGroup}>
          <button>{isSignUp ? "Sign Up" : "Log In"}</button>
        </div>
        {!isSignUp ? (
          <div className={styles.change}>
            Don't have an account? <span onClick={change}>Sign Up</span>
          </div>
        ) : (
          <div className={styles.change}>
            Already have an account? <span onClick={change}>Sign In</span>
          </div>
        )}
      </form>
    </div>
  );
}
