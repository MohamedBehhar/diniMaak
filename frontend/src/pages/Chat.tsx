import {
  getChats,
  getUserInfo,
  getCarpoolingById,
  setMessagesAsRead,
} from "../api/methods";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";
import { concatinatePictureUrl } from "../utils/helperFunctions";
import DefaultUserImage from "../assets/user.png";

interface CarpoolingInfo {
  departure: string;
  destination: string;
  departure_day: string;
  departure_time: string;
}

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [senderInfo, setSenderInfo] = useState({});
  const [receiverInfo, setReceiverInfo] = useState({});
  const [carpoolingInfo, setCarpoolingInfo] = useState({} as CarpoolingInfo);
  let { conversation_id, sender_id, receiver_id } = useParams();

  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const user_id = localStorage.getItem("id");
  const [placeholder, setPlaceholder] = useState("Type a message");

  const handleGetChats = async () => {
    try {
      const response = await getChats(sender_id, receiver_id, conversation_id);
      setChats(response);
    } catch (error) {
      console.log("error === ", error);
    }
  };

  useEffect(() => {
    setMessagesAsRead(conversation_id, receiver_id);
  }, []);

  useEffect(() => {
    getUserInfo(sender_id).then((response: any) => {
      setSenderInfo(response);
    });
    getUserInfo(receiver_id).then((response: any) => {
      setReceiverInfo(response);
    });
    getCarpoolingById(conversation_id).then((response: any) => {
      setCarpoolingInfo(response);
    });
  }, [sender_id, receiver_id, conversation_id]);

  const sendMsg = () => {
    if (!message || message.split(" ").join("") == "") {
      return;
    }
    socket.emit("sendMsg", {
      sender_id,
      receiver_id,
      conversation_id,
      message,
    });
    setChats([
      ...chats,
      { id: Math.random().toFixed(2), sender_id, receiver_id, message },
    ]);
    setMessage("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    socket.emit("isTyping", { sender_id });
  }, [message]);

  useEffect(() => {
    handleGetChats();
    socket.on("connection", () => {
      socket.emit("joinRoom", { sender_id });
    });
    socket.on("newMsg", () => {
      handleGetChats();
    });
    socket.on("receiverWriteMsg", (data: any) => {
      if (data.receiver_id == user_id) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });
    socket.on("receiverIsTyping", (data: any) => {
      console.log("receiverIsTyping ", data);
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
    <div className="container h-[95%] flex flex-col gap-1  p-2">
      <div className="bg-gray-200 p-2 rounded-lg flex gap-2 justify-between items-center mt-6">
        <h1 className="text-lg font-semibold">
          {carpoolingInfo.departure} - {carpoolingInfo.destination}
        </h1>{" "}
        <h2 className="text-md text-gray-600">
          {carpoolingInfo?.departure_day}
        </h2>
        <h1>{carpoolingInfo.departure_time
        }</h1>
      </div>
      <div
        className="flex-1 flex flex-col   overflow-y-scroll p-2 m-1 "
        ref={chatContainerRef}
      >
        {chats.map((chat: any) => {
          return (
            <div
              key={chat.id}
              className={`${
                chat.sender_id == sender_id
                  ? "bg-blue-50  self-end"
                  : "bg-red-50  self-start"
              } p-2 m-2 w-fit rounded-lg  flex gap-2 items-center max-w-[80%] text-wrap`}
            >
              <img
                src={
                  chat.sender_id == sender_id
                    ? concatinatePictureUrl(senderInfo.profile_picture || "")
                    : concatinatePictureUrl(receiverInfo.profile_picture || "")
                }
                className={`${
                  chat.sender_id == sender_id ? "order-2" : ""
                } w-10 h-10 rounded-full object-cover`}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = DefaultUserImage;
                }}
              />
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
            className="w-full border-2 border-gray-300 p-2 rounded-lg"
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("writeMsg", { sender_id, receiver_id });
            }}
            value={message}
            placeholder={placeholder}
          />

          <button className="ant-btn w-[100px]" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
