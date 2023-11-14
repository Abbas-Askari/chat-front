import { useEffect, useState } from "react";
import "./App.css";
import Login from "./features/login/login";
import Users from "./features/users/users";
import Messages from "./features/messages/messages";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";

import { initServerListenersAsync } from "./appSlice";

import { connect } from "./features/users/usersSlice";
import {
  gotMessage,
  recievedMessageAsync,
} from "./features/messages/messagesSlice";

const token = localStorage.getItem("token");

socket.on("connect", () => console.log("Connected successfully!"));

socket.on("connect_error", (error) => {
  console.error(error);
});

function App() {
  const { loggedUserId, users, selectedUserId } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) {
      if (token) {
        console.log("Trying to connext");

        dispatch(initServerListenersAsync());
        dispatch(connect({ token }));
        // socket.auth = { token };
        // socket.connect();
      }
    }
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
