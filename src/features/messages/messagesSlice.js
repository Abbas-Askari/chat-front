import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

// const fetchMessages = createAsyncThunk('messages/fetch', async () => {

// })

export const readAllMessagesOfUserAsync = createAsyncThunk(
  "read",
  async (userId, { dispatch, getState }) => {
    console.log("Reading async");
    socket.emit("read_all_messages_of_user", userId);
    dispatch(readAllMessagesOfUser(userId));
  }
);

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

export const recievedMessageAsync = createAsyncThunk(
  "messages/recieved",
  async (message) => {
    socket.emit("recieved_message_by_user", message);
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
      // console.log(
      //   "got this message: " + action.payload.content,
      //   action.payload
      // );
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

    messagesGotRead: (state, action) => {
      state.bundles
        .find((bundle) => bundle.id === action.payload.bundleId)
        .messages.forEach((message) => (message.read = true));
    },

    receivedByOther: (state, action) => {
      console.log({ payload: action.payload });
      const message = state.bundles
        .find((bundle) => bundle.id === action.payload.bundleId)
        .messages.find((message) => message.id === action.payload.messageId);
      // console.log({ message });
      // if (message)
      message.received = true;
    },

    readAllMessagesOfUser: (state, action) => {
      console.log("done Reading");
      state.bundles
        .find((bundle) => bundle.id === action.payload)
        .messages.forEach((m) => (m.read = true));
    },
  },
});

export var {
  gotMessage,
  startedEmptyChat,
  sentSuccessfully,
  sentMessage,
  receivedByOther,
  mess,
  messagesGotRead,
  readAllMessagesOfUser,
} = messagesSlice.actions;

export default messagesSlice.reducer;
