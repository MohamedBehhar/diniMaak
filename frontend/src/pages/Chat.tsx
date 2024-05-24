import { getChats } from "../api/methods";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  let { sender_id } = useParams();
  let { receiver_id } = useParams();
  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const user_id = localStorage.getItem("id");
  const [placeholder, setPlaceholder] = useState("Type a message");

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    socket.emit('isTyping', { sender_id, receiver_id })
  }, [message]);


  useEffect(() => {
    handleGetChats();
    socket.on("connection", () => {
      socket.emit("joinRoom", { sender_id, receiver_id });
    });
    socket.on("newMsg", () => {
      getChats(sender_id, receiver_id).then((response:any) => {
        setChats(response);
      });
    });
    socket.on("receiverWriteMsg", (data: any) => {
      if (data.receiver_id == user_id) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });
    socket.on('receiverIsTyping', (data: any) => {
      console.log('receiverIsTyping ', data);
      if (data.receiver_id == user_id) {
        setPlaceholder("Typing...");
        setTimeout(() => {
          setPlaceholder("Type a message");
        }, 2000);
      }
    });

    return () => {
      socket.off("newMsg");
    };
  }, [sender_id, receiver_id, socket]);

  return (
    <div className="container h-[80%] p-2">
      <h1>Chat</h1>
      <div
        className="h-[100%] flex flex-col overflow-y-scroll p-2"
        ref={chatContainerRef}
      >
        {chats.map((chat: any) => {
          return (
            <div
              key={chat.id}
              className={`${
                chat.sender_id == sender_id
                  ? "bg-blue-200  self-end"
                  : "bg-red-200  self-start"
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
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("writeMsg", { sender_id, receiver_id });
            }}
            value={message}
            placeholder={placeholder}
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
