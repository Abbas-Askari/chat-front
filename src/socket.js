import { io } from "socket.io-client";

// export const url = "http://localhost:3000";
export const baseUrl = "https://abbas-chat-back.onrender.com/";

const socket = io(baseUrl, { autoConnect: false });

export default socket;
