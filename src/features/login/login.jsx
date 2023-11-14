import { useDispatch } from "react-redux";
import socket from "../../socket";
import { initServerListenersAsync } from "../../appSlice";

export default function Login({}) {
  const dispatch = useDispatch();

  function submit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    socket.auth = { username, password };
    dispatch(initServerListenersAsync());
    socket.connect();
  }
  return (
    <form action="" onSubmit={submit}>
      <div className="formGroup">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
      </div>

      <div className="formGroup">
        <label htmlFor="password">Password</label>
        <input type="text" name="password" id="password" />
      </div>

      <button>Login</button>
    </form>
  );
}
