import { useEffect, useState } from "react";
import { getNotifications, changeNotificationStatus } from "../api/methods";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user_id = localStorage.getItem("id");
  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications on component mount
    getNotifications(user_id)
      .then((response: any) => {
        setNotifications(response);
      })
      .catch((error: any) => {
        message.error("Error while fetching notifications");
      });

    changeNotificationStatus(user_id)
      .then((response: any) => {
        console.log("response === ", response);
      })
      .catch((error: any) => {
        console.log("error === ", error);
      });

    // Cleanup function to mark all notifications as read on unmount
  }, []);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold text-center mt-5">Notifications</h1>
      <div>
        {notifications &&
          notifications.map((notification: any) => {
            return (
              <div
                key={notification.id}
                className={`${
                  notification.is_read ? "bg-gray-200" : "bg-white"
                } p-2 rounded-md shadow-md my-2  hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer flex justify-between items-center gap-2`}
              >
                <p>{notification.message}</p>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={() => {
                    Navigate(
                      "/carpooling-details/" +
                        notification.carpooling_id +
                        "/" +
                        1
                    );
                  }}
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
