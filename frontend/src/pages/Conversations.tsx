import { message } from "antd";
import { getConversations } from "../api/methods";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { concatinatePictureUrl } from "../utils/helperFunctions";

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
    fetchConversations();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl text-center p-5 text-cyan-600">Conversations</h1>
      <div className="flex flex-col gap-2 items-center justify-center">
        {conversations.length &&
          conversations.map((conversation: any) => {
            return (
              <div
                key={conversation.id}
                className="container flex w-full justify-between items-center p-5 border rounded-md shadow-md my-2 gap-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  Navigate(`/chat/${user_id}/${conversation.receiver_id}/${conversation.carpooling_id}`);
                }}
              >
                <img
                  src={
					concatinatePictureUrl(conversation.receiver_profile_picture)
				  }
                  alt="img"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
                  }}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="info flex-1">
                  <h1>{conversation.receiver_name}</h1>
                  <p>{conversation.message}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Conversations;
