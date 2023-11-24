import { useDispatch, useSelector } from "react-redux";
import socket, { url } from "../../socket";
import { initServerListenersAsync } from "../messages/appSlice";
import styles from "./login.module.css";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { clearedErrors, recivedError } from "./connectionSlice";

export default function Login({}) {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const [filename, setFilename] = useState("Select a file");
  const formRef = useRef();
  const { connectionError, connected } = useSelector(
    (state) => state.connection
  );

  async function submit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (!isSignUp) {
      socket.auth = { username, password };
      dispatch(initServerListenersAsync());
      socket.connect();
    } else {
      const formData = new FormData(formRef.current);
      const res = await fetch(`${url}/users`, {
        method: "POST",
        body: formData,
      });
      //   method: "POST",
      //   headers: {
      //     "Content-type": "application/json; charset=UTF-8",
      //   },
      //   body: JSON.stringify({ username, password, file }),
      // });
      const data = await res.json();
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
      <form
        ref={formRef}
        className={styles.form}
        // method="POST"
        onSubmit={submit}
        encType="multipart/form-data"
      >
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

        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="avatar">Avatar</label>
            <label>
              {filename}
              <input
                onChange={(e) => {
                  console.log({ e: e.target });
                  setFilename(e.target.value.split("\\").at(-1));
                }}
                type="file"
                name="avatar"
                id="avatar"
              />
            </label>
          </div>
        )}

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
