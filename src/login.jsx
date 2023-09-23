function sumbit(e, socket) {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  socket.auth = { username, password };
  socket.connect();
}

export default function Login({ socket }) {
  return (
    <form action="" onSubmit={(e) => sumbit(e, socket)}>
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
