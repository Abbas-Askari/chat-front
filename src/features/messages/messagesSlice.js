import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

// const fetchMessages = createAsyncThunk('messages/fetch', async () => {

// })

export const sentMessageAsync = createAsyncThunk(
  "messages/send",
  async (message, { getState, dispatch }) => {
    console.log("Sneding");
    dispatch(sentMessage(message));
    socket.emit("send_message", message, ({ ok, messageId }) => {
      console.log({ ok, messageId });
      if (ok) {
        dispatch(
          sentSuccessfully({
            messageId,
            bundleId: message.sentTo,
            date: message.date,
          })
        );
      }
    });
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    bundles: [],
  },
  reducers: {
    sentMessage: (state, action) => {
      state.bundles
        .find((bundle) => bundle.id === action.payload.sentTo)
        .messages.push(action.payload);
    },
    gotMessage: (state, action) => {
      state.bundles
        .find((bundle) => bundle.id === action.payload.sentBy)
        .messages.push(action.payload);
    },
    sentSuccessfully: (state, action) => {
      // acion.payload must contain messageId and bundleId
      const message = state.bundles
        .find((bundle) => bundle.id === action.payload.bundleId)
        .messages.find((message) => message.date === action.payload.date);
      console.log({ message });
      message.sent = true;
      message.id = action.payload.messageId;
    },
    startedEmptyChat: (state, action) => {
      state.bundles.push({
        id: action.payload.userId,
        messages: [],
      });
    },
  },
});

export var { gotMessage, startedEmptyChat, sentSuccessfully, sentMessage } =
  messagesSlice.actions;

export default messagesSlice.reducer;
