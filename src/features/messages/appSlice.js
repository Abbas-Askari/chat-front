import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import socket from "../../socket";

import {
  otherUserSignedIn,
  otherUserSignedOut,
  readAllMessagesOfUser,
  gettingTypedTo,
  finishedGettingTypedTo,
  gotUsers,
  signedIn,
} from "../users/usersSlice";

import {
  gotMessage,
  mess,
  messagesGotRead,
  readAllMessagesOfUserAsync,
  receivedByOther,
  recievedMessageAsync,
  startedEmptyChat,
} from "./messagesSlice";

export const initServerListenersAsync = createAsyncThunk(
  "initServerListeners",
  async (_, { getState, dispatch }) => {
    socket.on("users", (users) => {
      dispatch(gotUsers(users));
      users.forEach((user) => dispatch(startedEmptyChat({ userId: user._id })));
    });

    // socket.on("users", callback);

    socket.on("session", ({ user, token }) => {
      if (token) {
        localStorage.setItem("token", token);
      }
      dispatch(signedIn(user));
    });

    // (() => {
    // })();

    (() => {
      const callback = (id) => {
        dispatch(otherUserSignedOut({ id }));
      };
      socket.on("offline", callback);
    })();

    (() => {
      const callback = (id) => {
        dispatch(otherUserSignedIn({ id }));
      };
      socket.on("online", callback);
    })();

    (() => {
      const callback = ({ messageId, bundleId }) => {
        dispatch(receivedByOther({ messageId, bundleId }));
      };
      socket.on("received_by_other", callback);
    })();

    (() => {
      const callback = (userId) => {
        dispatch(messagesGotRead({ bundleId: userId }));
      };
      socket.on("messages_got_read", callback);
    })();

    (() => {
      const callback = (userId) => {
        dispatch(messagesGotRead({ bundleId: userId }));
      };
      socket.on("messages_got_read", callback);
    })();

    (() => {
      const callback = (userId) => {
        dispatch(gettingTypedTo(userId));
      };
      socket.on("typing_from", callback);
    })();

    (() => {
      const callback = (userId) => {
        dispatch(finishedGettingTypedTo(userId));
      };
      socket.on("ended_typing_from", callback);
    })();
  }
);

const appSlice = createSlice({
  name: "app",
});
