import { io } from "socket.io-client";

// export const url = "http://localhost:3000";
export const url = "https://abbas-chat-back.onrender.com/";

const socket = io(url, { autoConnect: false });

export default socket;
