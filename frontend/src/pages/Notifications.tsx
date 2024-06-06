import { useEffect, useState } from "react";
import { getNotifications } from "../api/methods";
import { message } from "antd";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user_id = localStorage.getItem("id");

  useEffect(() => {
    getNotifications(user_id)
      .then((response: any) => {
        setNotifications(response);
      })
      .catch((error: any) => {
        message.error("Error while fetching notifications");
      });
  }, []);

  return (
    <div className="container">
      <h1
        className="text-3xl font-bold text-center mt-5"
      >Notifications</h1>
      <div>
        { notifications && notifications.map((notification: any) => {
          return (
            <div 
              key={notification.id}
              className="p-2 rounded-md shadow-md my-2 bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer flex justify-between items-center gap-2" 

            >
              <p>{notification.message}</p>
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                type="button"
              >
                Reserve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
