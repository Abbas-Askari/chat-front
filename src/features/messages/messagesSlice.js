import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

// const fetchMessages = createAsyncThunk('messages/fetch', async () => {

// })

export const readAllMessagesOfUserAsync = createAsyncThunk(
  "read",
  async (userId, { dispatch, getState }) => {
    socket.emit("read_all_messages_of_user", userId);
    const loggedUserId = getState().users.loggedUserId;
    const action = { bundleId: userId, loggedUserId };
    dispatch(readAllMessagesOfUser(action));
  }
);

export const sentMessageAsync = createAsyncThunk(
  "messages/send",
  async (message, { getState, dispatch }) => {
    dispatch(sentMessage(message));
    socket.emit("send_message", message, ({ ok, messageId }) => {
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
    haveSelectedFiles: false,
  },
  reducers: {
    selectedFiles: (state, action) => {
      state.haveSelectedFiles = true;
    },

    unselectedFiles: (state, action) => {
      state.haveSelectedFiles = false;
    },

    sentMessage: (state, action) => {
      state.bundles
        .find((bundle) => bundle.id === action.payload.sentTo)
        .messages.push(action.payload);
    },

    gotMessage: (state, action) => {
      let bundleId = action.payload.message.sentBy;
      if (action.payload.message.sentBy === action.payload.loggedUserId)
        bundleId = action.payload.message.sentTo;
      state.bundles
        .find((bundle) => bundle.id === bundleId)
        .messages.push(action.payload.message);
      // console.log({
      //   message: action.payload.message,
      //   bundleId,
      //   userId: action.payload.loggedUserId,
      // });
    },

    sentSuccessfully: (state, action) => {
      // acion.payload must contain messageId and bundleId
      const message = state.bundles
        .find((bundle) => bundle.id === action.payload.bundleId)
        .messages.find((message) => message.date === action.payload.date);
      message.sent = true;
      message._id = action.payload.messageId;
    },

    startedEmptyChat: (state, action) => {
      const index = state.bundles.findIndex(
        (bundle) => bundle.id === action.payload.userId
      );
      if (index === -1) {
        state.bundles.push({
          id: action.payload.userId,
          messages: [],
        });
      }
    },

    messagesGotRead: (state, action) => {
      state.bundles
        .find((bundle) => bundle.id === action.payload.bundleId)
        .messages.forEach((message) => {
          if (message.sentBy === action.payload.loggedUserId)
            message.read = true;
        });
    },

    recivedByOther: (state, action) => {
      try {
        state.bundles
          .find((bundle) => bundle.id === action.payload.bundleId)
          .messages.find(
            (message) => message._id === action.payload.messageId
          ).recived = true;
      } catch (e) {
        console.log(
          state.bundles.find((bundle) => bundle.id === action.payload.bundleId)
            .messages.length,
          JSON.parse(
            JSON.stringify(
              state.bundles.find(
                (bundle) => bundle.id === action.payload.bundleId
              )
            )
          ),
          action.payload
        );
        console.error("pakra gaya.", e.message);
      }
    },

    readAllMessagesOfUser: (state, action) => {
      state.bundles
        .find((bundle) => bundle.id === action.payload.bundleId)
        .messages.forEach((m) => {
          if (m.sentBy !== action.payload.loggedUserId) m.read = true;
        });
    },
  },
});

export var {
  gotMessage,
  startedEmptyChat,
  sentSuccessfully,
  sentMessage,
  recivedByOther,
  mess,
  messagesGotRead,
  readAllMessagesOfUser,
  selectedFiles,
  unselectedFiles,
} = messagesSlice.actions;

export default messagesSlice.reducer;
