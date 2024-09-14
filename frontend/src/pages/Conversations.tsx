import { message } from "antd";
import { getConversations } from "../api/methods";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { concatinatePictureUrl } from "../utils/helperFunctions";
import { format } from "date-fns";
import DefaultUserImage from "../assets/user.png";
import { socket } from "../socket/socket";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const user_id = localStorage.getItem("id");
  const Navigate = useNavigate();

  const fetchConversations = async () => {
    await getConversations(user_id)
      .then((response: any) => {
        setConversations(response);
      })
      .catch((error) => {
        message.error("Error while fetching conversations");
      });
  };

  useEffect(() => {
    socket.on("newMsg", () => {
      fetchConversations();
    });
    socket.on("sendMsg", () => {
      fetchConversations();
    });
    fetchConversations();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl text-center p-5 text-cyan-700">Conversations</h1>
      <div className="flex flex-col gap-2 items-center justify-center">
        {conversations.length ? (
          <div>
            {conversations.map((conversation: any) => {
              return (
                <div
                  key={conversation.id}
                  className={`${
                    conversation.is_read ? "bg-gray-100" : "bg-white"
                  } container flex w-full justify-between items-center p-5 border rounded-md shadow-md my-2 gap-2 cursor-pointer hover:bg-gray-100`}
                  onClick={() => {
                    Navigate(
                      `/chat/${user_id}/${conversation.receiver_id}/${conversation.conversation_id}`
                    );
                  }}
                >
                  <img
                    src={concatinatePictureUrl(
                      conversation.receiver_profile_picture
                    )}
                    alt="img"
                    onError={(e) => {
                      e.currentTarget.src = DefaultUserImage;
                    }}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="info flex-1 ">
                    <h1>{conversation.receiver_name}</h1>
                    <div>
                      <p className="text-gray-500">{conversation.message}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex gap-4 justify-between self-start">
                    <div className="flex gap-2 text-xl bold">
                      <span>{conversation.departure}</span>
                      <span>{conversation.destination}</span>
                    </div>
                    {/* <p>{format(conversation.departure_day, "EEEE, MM/yyyy")}</p> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h1 className="text-center text-lg">No conversations yet</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
