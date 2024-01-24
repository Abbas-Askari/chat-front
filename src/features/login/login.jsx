import { useDispatch, useSelector } from "react-redux";
import socket, { baseUrl } from "../../socket";
import { initServerListenersAsync } from "../messages/appSlice";
import styles from "./login.module.css";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { clearedErrors, recivedError } from "./connectionSlice";
import Icon from "@mdi/react";
import { mdiAccount, mdiUpload } from "@mdi/js";

// take the file input and send it to the server as base64 string avatart

export async function fileToBase64(file) {
  const reader = new FileReader();
  const fileCompressed = await compressImage(file, {
    quality: Math.min(50000 / file.size, 1),
  });
  reader.readAsDataURL(fileCompressed);
  return new Promise((resolve, reject) => {
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", (e) => {
      reject(e);
    });
  });
}

async function compressImage(file, { quality = 1, type = file.type }) {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0);
  return await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export default function Login({}) {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const formRef = useRef();
  const { connectionError, connected } = useSelector(
    (state) => state.connection
  );

  async function submit(e) {
    e.preventDefault();
    dispatch(clearedErrors());
    const username = e.target.username.value;
    const password = e.target.password.value;
    setLoading(true);
    if (!isSignUp) {
      socket.auth = { username, password };
      dispatch(initServerListenersAsync());
      socket.connect();
    } else {
      // const res = await fetch(`${baseUrl}users`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     username,
      //     password,
      //     avatar,
      //   }),
      // });
      // make a post request to the server
      const res = await fetch(`${baseUrl}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          avatar,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(clearedErrors());
        setIsSignUp(false);
      } else {
        dispatch(recivedError({ error: data.error }));
      }
    }
    setLoading(false);
  }

  function change() {
    setIsSignUp(!isSignUp);
  }

  return (
    <div className={styles.container}>
      <form ref={formRef} className={styles.form} onSubmit={submit}>
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
            type="password"
            name="password"
            placeholder="Password"
            id="password"
          />
        </div>

        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="avatar">Avatar</label>
            <input
              onChange={(e) => {
                fileToBase64(e.target.files[0]).then((data) => setAvatar(data));
              }}
              type="file"
              name="avatar"
              id="avatar"
            />
            {
              <div
                onClick={() => {
                  document.querySelector("#avatar").click();
                }}
                className={styles.formGroup + " " + styles.avatar}
              >
                {avatar ? (
                  <img src={avatar} />
                ) : (
                  <Icon path={mdiUpload} size={2} />
                )}
              </div>
            }
          </div>
        )}

        <div className={styles.formGroup}>
          <button>
            {loading ? (
              <span className={styles.loader}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              <>{isSignUp ? "Sign Up" : "Log In"}</>
            )}
          </button>
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
