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
    <div>
      <h1>Notifications</h1>
      <div>
        { notifications && notifications.map((notification: any) => {
          return (
            <div>
              <p>{notification.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
