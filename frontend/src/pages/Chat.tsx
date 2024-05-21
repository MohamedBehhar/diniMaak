import { useEffect } from "react";
import { getChats } from "../api/methods";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";
import { set } from "date-fns";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  let { sender_id } = useParams();
  let { receiver_id } = useParams();

  const handleGetChats = async () => {
    try {
      const response = await getChats(sender_id, receiver_id);
      setChats(response);
    } catch (error) {
      console.log("error === ", error);
    }
  };

  const sendMsg = () => {
    if (!message || message.split(" ").join("") == "") {
      return;
    }
    socket.emit("sendMsg", {
      sender_id,
      receiver_id,
      message,
    });
    setChats([...chats, { sender_id, receiver_id, message }]);
    setMessage("");
  };

  useEffect(() => {
    handleGetChats();
    socket.on("connection", () => {
      socket.emit("joinRoom", { sender_id, receiver_id });
    });
    socket.on("newMsg", (data) => {
      getChats(sender_id, receiver_id).then((response) => {
        console.log("response === ", response);
        setChats(response);
      });
    });
  }, [sender_id, receiver_id, socket]);

  return (
    <div className="container h-[80%] p-2">
      <h1>Chat</h1>
      <div className="h-[100%] flex flex-col overflow-y-scroll p-2">
        {chats.map((chat: any) => {
          return (
            <div
              key={chat.id}
              className={`${
                chat.sender_id == sender_id
                  ? "bg-red-200  self-end"
                  : "bg-blue-200  self-start"
              } p-2 m-2 w-fit rounded-lg `}
            >
              {chat.id}
              <h1>{chat.message}</h1>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <form
          action="0"
          className="flex gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            sendMsg();
          }}
        >
          <input
            type="text"
            name=""
            id=""
            className="w-full border-2 border-gray-300 p-2"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button className="bg-blue-500 p-2 text-white" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
