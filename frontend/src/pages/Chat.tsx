import socket from "../socket/socket";
import { useEffect } from "react";

const Chat = () => {
  useEffect(() => {
    socket.on("chat message", (msg: any) => {
      console.log("message: " + msg);
    });
  }, []);

  return <div></div>;
};

export default Chat;
