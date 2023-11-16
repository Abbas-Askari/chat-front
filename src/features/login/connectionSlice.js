import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";
import { connect } from "react-redux";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    connected: false,
    connectionError: "",
  },
  reducers: {
    recivedError: (state, action) => {
      console.log("Setting error");
      state.connectionError = action.payload.error;
      state.connected = !state.connected;
    },
    clearedErrors: (state, action) => {
      state.connectionError = "";
    },
  },
});

export var { recivedError, clearedErrors } = connectionSlice.actions;

export default connectionSlice.reducer;
