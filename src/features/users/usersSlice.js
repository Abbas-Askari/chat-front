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

const usersSlice = createSlice({
  name: "users",
  initialState: {
    loggedUserId: null,
    selectedUserId: null,
    users: [],
  },
  reducers: {
    otherUserSignedIn: (state, action) => {
      state.users.find((user) => user.id === action.payload.id).status =
        "Online";
    },

    otherUserSignedOut: (state, action) => {
      state.users.find((user) => user.id === action.payload.id).status =
        "Offline";
    },

    gotUsers: (state, action) => {
      state.users = action.payload;
    },

    signedIn: (state, action) => {
      state.loggedUserId = action.payload.id;
    },

    selectedUserWithId: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
  //   extraReducers: {},
});

export const {
  otherUserSignedIn,
  otherUserSignedOut,
  gotUsers,
  signedIn,
  selectedUserWithId,
} = usersSlice.actions;

export default usersSlice.reducer;
