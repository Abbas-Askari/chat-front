import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/usersSlice";
import messagesReducer from "../features/messages/messagesSlice";
import connectionReducer from "../features/login/connectionSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    messages: messagesReducer,
    connection: connectionReducer,
  },
});

export default store;
