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
  finishedGettingTypedTo,
  gettingTypedTo,
} from "./features/users/usersSlice";

import {
  gotMessage,
  mess,
  messagesGotRead,
  readAllMessagesOfUserAsync,
  receivedByOther,
  recievedMessageAsync,
  startedEmptyChat,
} from "./features/messages/messagesSlice";

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
      users.forEach((user) => dispatch(startedEmptyChat({ userId: user.id })));
    };
    socket.on("users", callback);

    return () => {
      socket.off("users", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (message) => {
      // cb({ ok: true });
      dispatch(gotMessage(message));
      dispatch(recievedMessageAsync(message));
      if (selectedUserId === message.sentBy) {
        console.log({ sentBy: message.sentBy, selectedUserId });
        dispatch(readAllMessagesOfUserAsync(selectedUserId));
      }
    };
    socket.on("recieve_message", callback);
    return () => {
      socket.off("recieve_message", callback);
    };
  }, [selectedUserId]);

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

  useEffect(() => {
    const callback = ({ messageId, bundleId }) => {
      dispatch(receivedByOther({ messageId, bundleId }));
    };
    socket.on("received_by_other", callback);
    return () => {
      socket.off("received_by_other", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (userId) => {
      dispatch(messagesGotRead({ bundleId: userId }));
    };
    socket.on("messages_got_read", callback);
    return () => {
      socket.off("messages_got_read", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (userId) => {
      dispatch(messagesGotRead({ bundleId: userId }));
    };
    socket.on("messages_got_read", callback);
    return () => {
      socket.off("messages_got_read", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (userId) => {
      dispatch(gettingTypedTo(userId));
    };
    socket.on("typing_from", callback);
    return () => {
      socket.off("typing_from", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (userId) => {
      dispatch(finishedGettingTypedTo(userId));
    };
    socket.on("ended_typing_from", callback);
    return () => {
      socket.off("ended_typing_from", callback);
    };
  }, []);

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
