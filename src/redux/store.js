import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/usersSlice";
import messagesReducer from "../features/messages/messagesSlice";

const store = configureStore({
  reducer: { users: userReducer, messages: messagesReducer },
});

export default store;
