import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

export const connect = createAsyncThunk("connect", async (auth) => {
  socket.auth = auth;
  return new Promise((resolve, reject) => {
    socket.connect();
    socket.on("connect", () => resolve());
    socket.on("connect_error", () => reject());
  });
});

export const getLoggedUser = createAsyncThunk("getLoggedUser", async (auth) => {
  return new Promise((resolve, reject) => {
    socket.connect();
    socket.on("connect", () => resolve());
    socket.on("connect_error", () => reject());
  });
});

export const startedTypingToAsync = createAsyncThunk(
  "typeTo",
  async (userId) => {
    socket.emit("typing_to", userId);
  }
);

export const finishedTypingToAsync = createAsyncThunk(
  "finishedTypingTo",
  async (userId) => {
    socket.emit("ended_typing_to", userId);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    loggedUserId: null,
    selectedUserId: null,
    query: "",
    users: [],
  },
  reducers: {
    otherUserSignedIn: (state, action) => {
      state.users.find((user) => user._id === action.payload.id).status =
        "Online";
    },

    otherUserSignedOut: (state, action) => {
      state.users.find((user) => user._id === action.payload.id).status =
        "Offline";
    },

    gotUsers: (state, action) => {
      console.log("Got users: ", action.payload);
      state.users = action.payload;
    },

    signedIn: (state, action) => {
      state.loggedUserId = action.payload.id || action.payload._id;
    },

    selectedUserWithId: (state, action) => {
      state.selectedUserId = action.payload;
    },

    gettingTypedTo: (state, action) => {
      state.users.find((user) => user._id === action.payload).status = "Typing";
    },

    finishedGettingTypedTo: (state, action) => {
      state.users.find((user) => user._id === action.payload).status = "Online";
    },

    changedQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

export const {
  otherUserSignedIn,
  otherUserSignedOut,
  gotUsers,
  signedIn,
  selectedUserWithId,
  changedQuery,
  readAllMessagesOfUser,
  gettingTypedTo,
  finishedGettingTypedTo,
} = usersSlice.actions;

export default usersSlice.reducer;
