import { io } from "socket.io-client";

// Use environment variable or default to localhost
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

export const socket = io(`${SERVER_URL}/rabisco`, {
  autoConnect: false
});
