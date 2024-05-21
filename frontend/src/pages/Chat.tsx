import { useEffect } from "react";
import { getChats } from "../api/methods";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  let { sender_id } = useParams();
  let { receiver_id } = useParams();

  console.log("sender_id === ", sender_id);
  console.log("receiver_id === ", receiver_id);

  const handleGetChats = async () => {
    try {
      const response = await getChats(sender_id, receiver_id);
      setChats(response);
    } catch (error) {
      console.log("error === ", error);
    }
  };

  const sendMsg = () => {
    socket.on('connection', () => {
      socket.emit('sendMsg', {
        sender_id,
        receiver_id,
        message,
      })
    })
    setMessage("");
  }

  useEffect(() => {
    handleGetChats();

  }, []);

  return (
    <div className="container">
      <h1>Chat</h1>
      <div className="h-[200px] w-full">
        {chats.map((chat: any) => {
          return (
            <div
              key={chat.id}
              className={
                chat.sender_id === sender_id
                  ? "bg-red-200 w-full text-right"
                  : "bg-blue-200 w-full text-left"
              }
            >
              <h1>{chat.message}</h1>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input type="text" name="" id=""
          className="w-full border-2 border-gray-300 p-2"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          className="bg-blue-500 p-2 text-white"
          onClick={() => sendMsg()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
