import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import socket from "../../socket";

import {
  otherUserSignedIn,
  otherUserSignedOut,
  gettingTypedTo,
  finishedGettingTypedTo,
  gotUsers,
  signedIn,
} from "../users/usersSlice";

import {
  messagesGotRead,
  recivedByOther,
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
      console.log({ user });
      dispatch(signedIn(user));
      socket.emit("ready_to_recive");
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
        console.log("Recived messages!");
        dispatch(recivedByOther({ messageId, bundleId }));
      };
      socket.on("recived_by_other", callback);
    })();

    (() => {
      const callback = (userId) => {
        const loggedUserId = getState().users.loggedUserId;
        dispatch(messagesGotRead({ bundleId: userId, loggedUserId }));
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
  initialState: {
    showingUsers: true,
  },
  reducers: {
    showUsersPane: (state, action) => {
      state.showingUsers = true;
    },
    showMessages: (state, action) => {
      state.showingUsers = false;
    },
  },
});

export const { showMessages, showUsersPane } = appSlice.actions;

export default appSlice.reducer;
