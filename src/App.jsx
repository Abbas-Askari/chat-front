import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import Login from "./login";
import Users from "./users";
import Messages from "./messages";

const socket = io("http://localhost:3000", { autoConnect: false });
const token = localStorage.getItem("token");

socket.on("connect_error", (error) => {
  console.error(error);
});

if (token) {
  socket.auth = { token };
  socket.connect();
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);

  function submit(e) {
    e.preventDefault();
    const messageInput = e.target.message;
    const usernameInput = e.target.username;
    socket.emit("send_message", {
      content: messageInput.value,
      username: usernameInput.value,
    });
    messageInput.value = "";
  }

  useEffect(() => {
    const updateMessages = (message) => {
      let id =
        message.sentBy === loggedUser.id ? message.sentTo : message.sentBy;
      setMessages(() => {
        const bundle = messages.find((bundle) => bundle.id === id);
        if (bundle) {
          return messages.map((b) =>
            b === bundle ? { id, messages: [...bundle.messages, message] } : b
          );
        } else {
          return [...messages, { id, messages: [message] }];
        }
      });
      // message.map();
      // setMessages();
    };

    socket.on("recieve_message", updateMessages);
    return () => {
      socket.off("recieve_message", updateMessages);
    };
  }, [loggedUser, messages]);

  useEffect(() => {
    const connect = (data) => {
      setIsLoggedIn(true);
    };

    const online = (id) => {
      setUsers((users) =>
        users.map((user) =>
          user.id === id ? { ...user, status: "Online" } : user
        )
      );
    };

    const offline = (id) => {
      setUsers((users) =>
        users.map((user) =>
          user.id === id ? { ...user, status: "Offline" } : user
        )
      );
    };

    const getUserData = (data) => {
      if (data.token) localStorage.setItem("token", data.token);
      console.log("Setting token to: ", data.token, { data });
      setLoggedUser(data.user);
    };

    function log(data, ...args) {
      console.log({ data, args });
    }

    const users = (usrs) => {
      setUsers(usrs);
      setSelected(usrs[0]);
    };

    socket.on("connect", connect);
    socket.on("users", users);
    socket.on("session", getUserData);
    socket.on("online", online);
    socket.on("offline", offline);
    socket.onAny(log);

    return () => {
      socket.off("connect", connect);
      socket.off("users", users);
      socket.off("session", getUserData);
      socket.off("online", online);
      socket.off("offline", offline);
      socket.offAny(log);
    };
  }, []);

  return (
    <>
      <div className="content">
        {!isLoggedIn ? (
          <Login socket={socket} />
        ) : (
          <>
            <Users
              users={users}
              selected={selected}
              setSelected={setSelected}
              loggedUser={loggedUser}
            />
            <Messages
              userOther={selected}
              messages={messages}
              setMessages={setMessages}
              socket={socket}
              userLoggedIn={loggedUser}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
