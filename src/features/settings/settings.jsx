import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearedErrors, recivedError } from "../login/connectionSlice";
import socket, { baseUrl } from "../../socket";
import { fileToBase64 } from "../login/login";

function Settings() {
  const { users, loggedUserId } = useSelector((state) => state.users);

  const loggedUser = users.find((user) => user._id === loggedUserId);
  const [username, setUsername] = useState(loggedUser.username);
  const [password, setPassword] = useState(loggedUser.password);
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  async function update() {
    setLoading(true);
    console.log(avatar);
    try {
      const res = await fetch(`${baseUrl}users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username,
          password,
          avatar,
        }),
      });

      if (res.ok) {
        localStorage.clear();
        socket.close();
        window.location.reload(false);
      } else {
        if (res.status === 413) {
          setError("File too large");
        } else {
          setError(data.error);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const url = avatar || loggedUser.avatar;

  return (
    <dialog id="settings" className="modal" open={true}>
      <div className="modal-box w-min">
        <h3 className="font-bold text-lg flex justify-between items-center">
          <span>Settings</span>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle">x</button>
          </form>
        </h3>

        <div className=" flex flex-col items-center">
          <div
            className="avatar cursor-pointer hover:brightness-90 rounded-full"
            onClick={() => {
              document.querySelector("#file").click();
            }}
          >
            <div className="w-20 rounded-full">
              {url ? (
                <img src={url} />
              ) : (
                <div className="bg-neutral text-neutral-content rounded-full h-full flex justify-center items-center">
                  <span className="text-xl">
                    {loggedUser.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <h1 className="font-bold text-xl">{loggedUser.username}</h1>
        </div>
        <div className="">
          <input
            type="file"
            name="avatar"
            id="file"
            className=" hidden"
            onChange={(e) => {
              fileToBase64(e.target.files[0]).then((data) => setAvatar(data));
            }}
          />
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered"
            defaultValue={loggedUser.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            placeholder="Enter previous password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-error">{error}</div>}

        <div className="flex justify-center gap-2 my-3">
          <button
            className="btn flex-1"
            onClick={() => {
              dispatch(clearedErrors());
              document.querySelector("#settings").close();
            }}
          >
            Cancel
          </button>
          <button
            className="btn flex-1 btn-primary"
            onClick={update}
            aria-disabled={loading}
          >
            Save
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default Settings;
