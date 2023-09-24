import { useEffect, useState } from "react";
import "./App.css";
import Login from "./features/login/login";
import Users from "./features/users/users";
import Messages from "./features/messages/messages";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import {
  connect,
  gotUsers,
  otherUserSignedIn,
  otherUserSignedOut,
  signedIn,
} from "./features/users/usersSlice";
import { gotMessage } from "./features/messages/messagesSlice";

const token = localStorage.getItem("token");

socket.on("connect", () => console.log("Connected successfully!"));

socket.on("connect_error", (error) => {
  console.error(error);
});

if (token) {
  // socket.auth = { token };
  // socket.connect();
}

function App() {
  const { loggedUserId, users, selectedUserId } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();

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
    if (!socket.connected) {
      if (token) {
        dispatch(connect({ token }));
      }
    }
  }, []);

  useEffect(() => {
    const callback = ({ user, token }) => {
      if (token) {
        console.log("Setting localStorage Token to : ", token);
        localStorage.setItem("token", token);
      }
      console.log({ user });
      dispatch(signedIn(user));
    };
    socket.on("session", callback);

    return () => {
      socket.off("session", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (users) => {
      console.log({ users });
      dispatch(gotUsers(users));
    };
    socket.on("users", callback);

    return () => {
      socket.off("users", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (message, cb) => {
      dispatch(gotMessage(message));
      cb({ ok: true });
    };
    socket.on("recieve_message", callback);
    return () => {
      socket.off("recieve_message", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (id) => {
      dispatch(otherUserSignedOut({ id }));
    };
    socket.on("offline", callback);
    return () => {
      socket.off("offline", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (id) => {
      dispatch(otherUserSignedIn({ id }));
    };
    socket.on("online", callback);
    return () => {
      socket.off("online", callback);
    };
  }, []);

  // useEffect(() => {
  //   const updateMessages = (message) => {
  //     let id =
  //       message.sentBy === loggedUser.id ? message.sentTo : message.sentBy;
  //     setMessages(() => {
  //       const bundle = messages.find((bundle) => bundle.id === id);
  //       if (bundle) {
  //         return messages.map((b) =>
  //           b === bundle ? { id, messages: [...bundle.messages, message] } : b
  //         );
  //       } else {
  //         return [...messages, { id, messages: [message] }];
  //       }
  //     });
  //     // message.map();
  //     // setMessages();
  //   };

  //   socket.on("recieve_message", updateMessages);
  //   return () => {
  //     socket.off("recieve_message", updateMessages);
  //   };
  // }, [loggedUser, messages]);

  // useEffect(() => {
  //   const connect = (data) => {
  //     setIsLoggedIn(true);
  //   };

  //   const online = (id) => {
  //     setUsers((users) =>
  //       users.map((user) =>
  //         user.id === id ? { ...user, status: "Online" } : user
  //       )
  //     );
  //   };

  //   const offline = (id) => {
  //     setUsers((users) =>
  //       users.map((user) =>
  //         user.id === id ? { ...user, status: "Offline" } : user
  //       )
  //     );
  //   };

  //   const getUserData = (data) => {
  //     if (data.token) localStorage.setItem("token", data.token);
  //     console.log("Setting token to: ", data.token, { data });
  //     setLoggedUser(data.user);
  //   };

  //   function log(data, ...args) {
  //     console.log({ data, args });
  //   }

  //   const users = (usrs) => {
  //     setUsers(usrs);
  //     setSelected(usrs[0]);
  //   };

  //   socket.on("connect", connect);
  //   socket.on("users", users);
  //   socket.on("session", getUserData);
  //   socket.on("online", online);
  //   socket.on("offline", offline);
  //   socket.onAny(log);

  //   return () => {
  //     socket.off("connect", connect);
  //     socket.off("users", users);
  //     socket.off("session", getUserData);
  //     socket.off("online", online);
  //     socket.off("offline", offline);
  //     socket.offAny(log);
  //   };
  // }, []);

  return (
    <>
      <div className="content">
        {loggedUserId === null ? (
          <Login />
        ) : (
          <>
            {users.length !== 0 && <Users />}
            <Messages />
          </>
        )}
      </div>
    </>
  );
}

export default App;
