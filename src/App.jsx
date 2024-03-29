import { useEffect, useState } from "react";
import "./App.css";
import Login from "./features/login/login";
import Users from "./features/users/users";
import Messages from "./features/messages/Messages";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";

import { initServerListenersAsync } from "./features/messages/appSlice";

import { connect } from "./features/users/usersSlice";
import {
  gotMessage,
  readAllMessagesOfUserAsync,
  recievedMessageAsync,
} from "./features/messages/messagesSlice";
import { faDisplay } from "@fortawesome/free-solid-svg-icons";
import { recivedError } from "./features/login/connectionSlice";
import Settings from "./features/settings/settings";

const token = localStorage.getItem("token");

socket.on("connect", () => console.log("Connected successfully!"));

function App() {
  const { loggedUserId, users, selectedUserId } = useSelector(
    (state) => state.users
  );

  console.log({ loggedUserId });
  const dispatch = useDispatch();

  const loggedUser = users.find((user) => user._id === loggedUserId);
  console.log({ loggedUser });

  useEffect(() => {
    socket.on("connect_error", (error) => {
      dispatch(recivedError({ error: error.message }));
      console.log({ error }, error.message);
    });
    if (!socket.connected) {
      if (token) {
        console.log("Trying to connect");

        dispatch(initServerListenersAsync());
        dispatch(connect({ token }));
      }
    }
    return () => socket.off("connect_error");
  }, []);

  useEffect(() => {
    if (loggedUser != null) {
      console.log("READY!", loggedUserId);
      socket.emit("ready_to_recive");
    }
  }, [loggedUserId]);

  useEffect(() => {
    const callback = (message) => {
      // cb({ ok: true });
      dispatch(gotMessage({ message, loggedUserId }));
      dispatch(recievedMessageAsync(message));
      if (selectedUserId === message.sentBy) {
        dispatch(readAllMessagesOfUserAsync(selectedUserId));
      }
    };
    socket.on("recieve_message", callback);
    console.log("installed", loggedUserId);
    socket.on("recive_initial_messages", ({ messages }) => {
      console.log(messages, loggedUserId);
      for (let message of messages) {
        dispatch(gotMessage({ message, loggedUserId }));
        dispatch(recievedMessageAsync(message));
      }
    });

    return () => {
      console.log("UNinstalled");
      socket.off("recieve_message", callback);
      socket.off("recive_initial_messages");
    };
  }, [selectedUserId, loggedUserId]);

  return (
    <>
      {loggedUserId === null ? (
        <Login />
      ) : (
        <>
          <div className="content">
            {users.length !== 0 && <Users />}
            <Messages />
          </div>
          <Settings />
        </>
      )}
    </>
  );
}

export default App;
